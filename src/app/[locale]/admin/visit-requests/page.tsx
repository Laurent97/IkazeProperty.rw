'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VisitRequestsRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new admin login page
    router.replace('/admin/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to new admin panel...</p>
      </div>
                      }
                    }}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                )}
                
                {/* Cancel - available for any active request */}
                {selectedRequest.status !== 'cancelled' && selectedRequest.status !== 'released' && selectedRequest.status !== 'refunded' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this visit request?')) {
                        updateRequestStatus(selectedRequest.id, 'cancelled', 'Cancelled by admin')
                        setShowDetailsModal(false)
                      }
                    }}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Request
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
