'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WatermarkManager() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/batch-watermark', {
        method: 'GET',
      })
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError('Failed to fetch statistics')
    }
  }

  const processBatch = async (dryRun = false) => {
    setIsProcessing(true)
    setError('')
    
    try {
      const response = await fetch('/api/batch-watermark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchSize: 25, // Process smaller batches for reliability
          dryRun
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(data)
        // Refresh stats after processing
        await fetchStats()
      } else {
        setError(data.error || 'Processing failed')
      }
    } catch (err) {
      setError('Failed to process batch')
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Watermark Manager</h1>
        <p className="text-gray-600">Apply "www.ikazeproperty.org" watermarks to existing images</p>
      </div>

      {/* Statistics */}
      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Watermark Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.watermarked}</div>
                <div className="text-sm text-gray-600">Watermarked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.unwatermarked}</div>
                <div className="text-sm text-gray-600">Need Watermark</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.percentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => processBatch(true)}
              disabled={isProcessing}
              variant="outline"
            >
              Dry Run (Preview)
            </Button>
            <Button
              onClick={() => processBatch(false)}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Processing...' : 'Apply Watermarks (25 images)'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Processed:</span>
                <span className="font-bold">{results.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Successful:</span>
                <span className="font-bold text-green-600">{results.processed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Failed:</span>
                <span className="font-bold text-red-600">{results.failed}</span>
              </div>
            </div>

            {results.results && results.results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Processed Images:</h4>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {results.results.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        result.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            ID: {result.id}
                          </div>
                          {result.listing_title && (
                            <div className="text-xs text-gray-600">
                              Listing: {result.listing_title}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.success ? 'Success' : 'Failed'}
                        </div>
                      </div>
                      {result.error && (
                        <div className="text-xs text-red-600 mt-1">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent>
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
