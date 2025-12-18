"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle2, Info } from "lucide-react"
import { bnsSuggestionService, type BNSSuggestion } from "@/lib/bns-suggestions"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BNSSuggestionsPanelProps {
  incidentType: string
  description: string
  location?: string
  onSelectSections: (sections: string[]) => void
  selectedSections: string[]
  isLoading?: boolean
}

export function BNSSuggestionsPanel({
  incidentType,
  description,
  location,
  onSelectSections,
  selectedSections,
  isLoading = false,
}: BNSSuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<BNSSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [error, setError] = useState("")
  const [hasRequested, setHasRequested] = useState(false)

  const handleGetSuggestions = async () => {
    if (!incidentType || !description) {
      setError("Please fill in the incident type and description first")
      return
    }

    setIsLoadingSuggestions(true)
    setError("")
    setHasRequested(true)

    try {
      const results = await bnsSuggestionService.suggestBNSSections(incidentType, description, location)
      setSuggestions(results)
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.")
      console.error(err)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSelectSection = (sectionNumber: string) => {
    const newSelected = selectedSections.includes(sectionNumber)
      ? selectedSections.filter((s) => s !== sectionNumber)
      : [...selectedSections, sectionNumber]
    onSelectSections(newSelected)
  }

  const handleSelectAll = () => {
    const allSectionNumbers = suggestions.map((s) => s.section.section_number)
    onSelectSections(allSectionNumbers)
  }

  const handleClearAll = () => {
    onSelectSections([])
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle>AI-Powered BNS Suggestions</CardTitle>
              <CardDescription>Get intelligent section recommendations based on your incident details</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasRequested ? (
          <div className="space-y-4">
            <Alert className="border-blue-300 bg-blue-100 text-blue-900 dark:border-blue-700 dark:bg-blue-900/50 dark:text-blue-100">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Click "Get AI Suggestions" to automatically analyze your incident details and recommend relevant BNS
                sections. This uses AI to match your case with applicable law sections.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleGetSuggestions}
              disabled={isLoadingSuggestions || !incidentType || !description || isLoading}
              className="w-full"
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Incident...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Analyzing your incident with AI...</p>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {suggestions.length} suggestions found • {selectedSections.length} selected
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleSelectAll}>
                      Select All
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleClearAll}>
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {suggestions.map((suggestion) => {
                    const isSelected = selectedSections.includes(suggestion.section.section_number)
                    return (
                      <div
                        key={suggestion.section.section_number}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30"
                            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300"
                        }`}
                        onClick={() => handleSelectSection(suggestion.section.section_number)}
                      >
                        <div className="flex items-start gap-3">
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                Section {suggestion.section.section_number}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.confidence}% match
                              </Badge>
                            </div>
                            <p className="font-medium text-sm mt-1">{suggestion.section.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{suggestion.reasoning}</p>
                            {suggestion.matchedKeywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {suggestion.matchedKeywords.slice(0, 3).map((kw, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">No matching sections found</p>
                <Button size="sm" variant="outline" onClick={() => setHasRequested(false)}>
                  Try Different Details
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
