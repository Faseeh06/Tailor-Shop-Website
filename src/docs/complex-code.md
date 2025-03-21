# Complex Code Examples - Tailor Shop Website

This document highlights key complex code implementations in the Tailor Shop Website project, demonstrating the use of advanced programming techniques, object-oriented principles, and data structures.

## 1. Role-Based Authentication System

My implementation uses Firebase Authentication combined with a custom role-based permission system, allowing different user interfaces for customers, tailors, and administrators.

```typescript
export const checkAuthorization = async (allowedRoles: UserRole[]) => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        resolve(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
          resolve(false)
          return
        }

        const userRole = userDoc.data().role
        resolve(allowedRoles.includes(userRole))
      } catch (error) {
        console.error('Error checking authorization:', error)
        resolve(false)
      }
    })

    // Cleanup subscription
    return () => unsubscribe()
  })
}
```

This code is complex because it:
- Uses asynchronous Promise-based authentication checking
- Implements security through role-based access control
- Handles multiple user types with different permissions
- Provides cleanup through subscription management

## 2. Firebase Transaction for Unique Order IDs

I implemented atomic transactions to generate sequential order numbers, ensuring no duplicate order numbers even with concurrent submissions.

```typescript
const orderNumber = await runTransaction(db, async (transaction) => {
  const counterRef = doc(db, 'counters', 'orders')
  const counterDoc = await transaction.get(counterRef)
  
  let newNumber = 1
  if (counterDoc.exists()) {
    newNumber = (counterDoc.data().count || 0) + 1
    transaction.update(counterRef, { count: newNumber })
  } else {
    transaction.set(counterRef, { count: 1 })
  }
  
  return `Order-${newNumber.toString().padStart(4, '0')}`
})
```

This code is complex because it:
- Uses database transactions for data integrity
- Implements atomic operations to prevent race conditions
- Creates a custom sequential ID system
- Handles edge cases for first-time counter creation

## 3. Real-time Data Subscription with Firestore

My application uses Firestore's real-time capabilities to instantly update the UI when order statuses change.

```typescript
useEffect(() => {
  if (!authorized) return

  const unsubscribe = onSnapshot(
    query(collection(db, "orders")),
    (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order))
      setOrders(ordersData)
      setLoading(false)
    },
    (error) => {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders")
      setLoading(false)
    }
  )

  return () => unsubscribe()
}, [authorized])
```

This code is complex because it:
- Implements real-time data synchronization patterns
- Uses the observer pattern for event-driven updates
- Handles error cases and loading states
- Properly manages component lifecycle with cleanup functions

## 4. Dynamic Filtering and Sorting System

I developed a complex filtering and sorting system for the gallery items using Zustand state management.

```typescript
const getFilteredAndSortedItems = () => {
  let filtered = items.filter(item => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      if (!item.title.toLowerCase().includes(searchLower) &&
          !item.description.toLowerCase().includes(searchLower) &&
          !item.price.toString().includes(searchLower)) {
        return false
      }
    }

    // Price range filter
    if (priceRange) {
      const price = Number(item.price)
      const [min, max] = priceRange.split('-').map(Number)
      if (max) {
        if (price < min || price > max) return false
      } else {
        // For "5000+" case
        if (price < min) return false
      }
    }

    return true
  })

  // Sort items
  if (sortBy) {
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price)
        case 'price-high':
          return Number(b.price) - Number(a.price)
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })
  }

  return filtered
}
```

This code is complex because it:
- Implements a custom multi-criteria filtering algorithm
- Handles dynamic sorting with multiple sort options
- Processes complex data transformations
- Manages special cases for different filter types

## 5. Custom Context API for Global Authentication State

I created a custom authentication context provider that manages user authentication state across the application.

```typescript
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const updateAuthState = async () => {
    const user = auth.currentUser
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const role = userDoc.data()?.role || null
      setUserRole(role)
      setIsAuthenticated(true)
      localStorage.setItem('userRole', role)
      localStorage.setItem('isAuthenticated', 'true')
    } else {
      setUserRole(null)
      setIsAuthenticated(false)
      localStorage.removeItem('userRole')
      localStorage.removeItem('isAuthenticated')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await updateAuthState()
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loading, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}
```

This code is complex because it:
- Implements the Context API for global state management
- Uses React hooks for state management within context
- Synchronizes authentication state with Firebase
- Provides a consistent authentication experience across components

## 6. Image Upload and Processing

I developed a system to handle image uploads for custom orders, including validation and preview functionality.

```typescript
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}

const handleImageUpload = async (file: File) => {
  try {
    const imageId = uuidv4()
    const storageRef = ref(storage, `orders/${auth.currentUser!.uid}/${imageId}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}
```

This code is complex because it:
- Manages file uploads to cloud storage
- Transforms binary data to Data URLs for preview
- Handles asynchronous operations with proper error handling
- Creates unique file paths to prevent collisions

## 7. Responsive Route Protection System

I implemented a route protection system that uses multiple approaches to secure routes based on user roles.

```typescript
const TailorLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { userRole, loading } = useAuth()

  useEffect(() => {
    if (!loading && userRole !== 'tailor') {
      router.push('/login')
    }
  }, [userRole, router, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  if (userRole !== 'tailor') {
    return <div>Unauthorized. Redirecting...</div>
  }

  return <div className="tailor-dashboard-layout">{children}</div>
}
```

This code is complex because it:
- Uses layout-based route protection for consistent security
- Handles loading states to prevent flickering
- Provides immediate feedback for unauthorized access
- Integrates with Next.js router for proper redirects

## 8. Advanced Form Validation with Custom Hooks

I created a reusable validation system using custom hooks to handle complex form validation throughout the application.

```typescript
const useFormValidation = (initialState: FormState, validationRules: ValidationRules) => {
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0
      if (noErrors) {
        // Ready to submit
        setIsSubmitting(false)
      } else {
        setIsSubmitting(false)
      }
    }
  }, [errors, isSubmitting])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Real-time validation for specific fields
    if (validationRules[name]?.validateOnChange) {
      const fieldError = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: fieldError }))
    }
    setValues({ ...values, [name]: value })
  }

  const validateField = (fieldName: string, value: string): string => {
    if (!validationRules[fieldName]) return ""
    
    const rules = validationRules[fieldName]
    
    if (rules.required && !value.trim()) {
      return "This field is required"
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || "Invalid format"
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`
    }
    
    if (rules.custom) {
      return rules.custom(value, values) || ""
    }
    
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.keys(validationRules).forEach(fieldName => {
      const value = values[fieldName] as string
      const error = validateField(fieldName, value)
      if (error) {
        newErrors[fieldName] = error
      }
    })
    
    setErrors(newErrors)
    setIsSubmitting(Object.keys(newErrors).length === 0)
    
    return Object.keys(newErrors).length === 0
  }

  return { values, errors, handleChange, handleSubmit, setValues }
}
```

This code is complex because it:
- Implements a custom hook for managing form state and validation
- Provides real-time and submission-time validation
- Handles different validation rules with extensible patterns
- Supports custom validation functions for complex relationships between fields

## 9. Optimized Image Handling with Server Components

I implemented a hybrid client-server approach for efficient image handling in custom orders, reducing client-side processing.

```tsx
// Server component
export async function generateImagePreviews(orderId: string) {
  const orderDoc = await getDoc(doc(db, 'orders', orderId))
  if (!orderDoc.exists()) return null
  
  const order = orderDoc.data()
  const imageUrl = order.imageUrl
  
  if (!imageUrl) return null
  
  try {
    // Generate thumbnails using server capabilities
    const sizes = ['small', 'medium', 'large']
    const previews = await Promise.all(sizes.map(async size => {
      const dimensions = {
        small: { width: 100, height: 100 },
        medium: { width: 300, height: 300 },
        large: { width: 600, height: 600 }
      }[size]
      
      const resizedUrl = await generateResizedImage(
        imageUrl, 
        dimensions.width, 
        dimensions.height
      )
      
      return { size, url: resizedUrl }
    }))
    
    // Store the generated previews for future use
    await updateDoc(doc(db, 'orders', orderId), {
      imagePreviews: previews.reduce((acc, preview) => ({
        ...acc,
        [preview.size]: preview.url
      }), {})
    })
    
    return previews
  } catch (error) {
    console.error('Error generating previews:', error)
    return null
  }
}

// Client component
const OrderImageDisplay = ({ order }: { order: Order }) => {
  const [selectedSize, setSelectedSize] = useState('medium')
  
  const getImageForSize = () => {
    if (!order.imagePreviews) return order.imageUrl
    return order.imagePreviews[selectedSize] || order.imageUrl
  }
  
  return (
    <div className="order-image-container">
      {order.imageUrl && (
        <>
          <div className="relative h-48 w-48 mb-2">
            <Image
              src={getImageForSize()}
              alt="Order reference"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedSize('small')}
              className={`px-2 py-1 text-xs rounded ${
                selectedSize === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Small
            </button>
            <button 
              onClick={() => setSelectedSize('medium')}
              className={`px-2 py-1 text-xs rounded ${
                selectedSize === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button 
              onClick={() => setSelectedSize('large')}
              className={`px-2 py-1 text-xs rounded ${
                selectedSize === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Large
            </button>
          </div>
        </>
      )}
    </div>
  )
}
```

This code is complex because it:
- Combines server-side image processing with client-side display
- Optimizes image loading with different resolutions based on needs
- Uses asynchronous operations to generate multiple previews
- Implements a responsive UI for switching between image sizes

## 10. Performance-Optimized Gallery with Virtualization

I created a high-performance gallery that can handle hundreds of items without performance degradation using virtualization techniques.

```tsx
const VirtualizedGallery = ({ items }: { items: GalleryItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [itemsPerRow, setItemsPerRow] = useState(4)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  // Calculate how many items fit in a row based on container width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        const newItemsPerRow = Math.max(1, Math.floor(width / 280)) // 280px is item width + gap
        setContainerSize({ width, height: containerRef.current.clientHeight })
        setItemsPerRow(newItemsPerRow)
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  // Update visible range based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, clientHeight } = containerRef.current
        setScrollPosition(scrollTop)
        
        const itemHeight = 300 // Height of each gallery item
        const buffer = 5 * itemsPerRow // Buffer of items above and below viewport
        
        const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
        const endRow = Math.ceil((scrollTop + clientHeight) / itemHeight) + buffer
        
        setVisibleRange({
          start: startRow * itemsPerRow,
          end: Math.min(items.length, endRow * itemsPerRow)
        })
      }
    }
    
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll() // Initial calculation
    }
    
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [items.length, itemsPerRow])
  
  // Calculate total content height for proper scrollbar
  const totalRows = Math.ceil(items.length / itemsPerRow)
  const totalHeight = totalRows * 300 // 300px per row
  
  // Only render items in the visible range
  const visibleItems = items.slice(visibleRange.start, visibleRange.end)
  
  // Calculate positions for absolute positioning
  const getItemPosition = (index: number) => {
    const actualIndex = visibleRange.start + index
    const row = Math.floor(actualIndex / itemsPerRow)
    const col = actualIndex % itemsPerRow
    const width = containerSize.width / itemsPerRow
    
    return {
      top: row * 300,
      left: col * width,
      width: width - 20 // Account for gap
    }
  }
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-screen overflow-auto"
    >
      <div 
        className="relative" 
        style={{ height: `${totalHeight}px` }}
      >
        {visibleItems.map((item, index) => {
          const position = getItemPosition(index)
          return (
            <div
              key={item.id}
              className="absolute p-2"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                height: '280px'
              }}
            >
              <GalleryItemCard item={item} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

This code is complex because it:
- Implements a windowing technique to only render visible items
- Dynamically calculates grid layout based on container dimensions
- Optimizes scroll performance with absolute positioning
- Handles responsive layout changes with buffer zones for smooth scrolling

## 11. Multi-step Form with State Management

I created a complex multi-step order form with state preservation between steps and validation at each stage.

```tsx
const steps = ['measurements', 'garment', 'details', 'confirmation']

const MultiStepOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<OrderFormData>({
    // Initial form state
    measurements: { chest: '', waist: '', hips: '', shoulders: '', sleeves: '', length: '', neck: '' },
    garmentType: '',
    fabricType: '',
    color: '',
    specialInstructions: '',
    estimatedBudget: '',
    preferredDeliveryDate: '',
    imageUrl: ''
  })
  const [stepValidity, setStepValidity] = useState<boolean[]>([false, false, false, true])
  
  const updateStepValidity = (step: number, isValid: boolean) => {
    const newValidity = [...stepValidity]
    newValidity[step] = isValid
    setStepValidity(newValidity)
  }
  
  const handleDataUpdate = (stepData: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }
  
  const canProceed = () => stepValidity[currentStep]
  
  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSubmit = async () => {
    try {
      // Final form submission logic
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step} className="text-sm capitalize">
              {step}
            </div>
          ))}
        </div>
      </div>
      
      {/* Form Steps */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStep === 0 && (
          <MeasurementsForm 
            data={formData.measurements} 
            updateData={(data) => handleDataUpdate({ measurements: data })}
            updateValidity={(isValid) => updateStepValidity(0, isValid)}
          />
        )}
        
        {currentStep === 1 && (
          <GarmentDetailsForm 
            data={{ garmentType: formData.garmentType, fabricType: formData.fabricType, color: formData.color }}
            updateData={handleDataUpdate}
            updateValidity={(isValid) => updateStepValidity(1, isValid)}
          />
        )}
        
        {currentStep === 2 && (
          <AdditionalDetailsForm 
            data={{ 
              specialInstructions: formData.specialInstructions, 
              estimatedBudget: formData.estimatedBudget,
              preferredDeliveryDate: formData.preferredDeliveryDate,
              imageUrl: formData.imageUrl
            }}
            updateData={handleDataUpdate}
            updateValidity={(isValid) => updateStepValidity(2, isValid)}
          />
        )}
        
        {currentStep === 3 && (
          <ConfirmationStep data={formData} />
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Submit Order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

This code is complex because it:
- Implements a multi-step form with progress tracking
- Maintains form state across different components
- Manages step-by-step validation
- Provides an intuitive UI with visual progress indication

## References

1. Firebase Documentation (2023) *Firestore Transactions and Batched Writes*. Available at: https://firebase.google.com/docs/firestore/manage-data/transactions (Accessed: 10 May 2023).

2. React Documentation (2023) *Context API*. Available at: https://reactjs.org/docs/context.html (Accessed: 12 May 2023).

3. Next.js Documentation (2023) *Authentication*. Available at: https://nextjs.org/docs/authentication (Accessed: 15 May 2023).

4. Zustand Documentation (2023) *State Management*. Available at: https://github.com/pmndrs/zustand (Accessed: 18 May 2023).

5. MDN Web Docs (2023) *Using the Web Storage API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API (Accessed: 20 May 2023).

6. React Query Documentation (2023) *Queries*. Available at: https://tanstack.com/query/latest/docs/react/guides/queries (Accessed: 22 May 2023).

7. TailwindCSS Documentation (2023) *Responsive Design*. Available at: https://tailwindcss.com/docs/responsive-design (Accessed: 25 May 2023).

8. TypeScript Documentation (2023) *TypeScript and React: Components*. Available at: https://www.typescriptlang.org/docs/handbook/react.html (Accessed: 27 May 2023).

9. FirebaseUI Web Documentation (2023) *FirebaseUI Auth*. Available at: https://firebase.google.com/docs/auth/web/firebaseui (Accessed: 28 May 2023).
