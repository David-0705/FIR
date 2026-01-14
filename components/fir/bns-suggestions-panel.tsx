"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Info } from "lucide-react"
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
      const results = await bnsSuggestionService.suggestBNSSections(
        incidentType,
        description,
        location
      )
      setSuggestions(results)
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.")
      console.error(err)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSelectSection = (section: BNSSuggestion["section"]) => {
    const sectionString = `Section ${section.section_number} - ${section.title}`

    const newSelected = selectedSections.includes(sectionString)
      ? selectedSections.filter((s) => s !== sectionString)
      : [...selectedSections, sectionString]

    onSelectSections(newSelected)
  }

  const handleSelectAll = () => {
    const allSections = suggestions.map(
      (s) => `Section ${s.section.section_number} - ${s.section.title}`
    )
    onSelectSections(allSections)
  }

  const handleClearAll = () => {
    onSelectSections([])
  }

  return (
    <Card className="border-blue-200 bg-transparent dark:border-blue-900">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <CardTitle>AI-Powered BNS Suggestions</CardTitle>
            <CardDescription>
              Get intelligent section recommendations based on your incident details
            </CardDescription>
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
            <Alert className="border-blue-300 bg-transparent">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Click "Get AI Suggestions" to analyze the incident and recommend BNS sections.
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
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {suggestions.length} suggestions • {selectedSections.length} selected
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
                    const sectionString = `Section ${suggestion.section.section_number} - ${suggestion.section.title}`
                    const isSelected = selectedSections.includes(sectionString)

                    return (
                      <div
                        key={suggestion.section.section_number}
                        className="p-3 rounded-lg border bg-white cursor-pointer"
                        onClick={() => handleSelectSection(suggestion.section)}
                      >
                        <div className="flex items-start gap-3">
                          {/* CUSTOM RADIO */}
                          <div
                            className="h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5"
                            style={{
                              borderColor: isSelected ? "#2563eb" : "#000",
                              backgroundColor: isSelected ? "#2563eb" : "transparent",
                            }}
                          >
                            {isSelected && (
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "9999px",
                                  backgroundColor: "#fff",
                                }}
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-600">
                                Section {suggestion.section.section_number}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.confidence}% match
                              </Badge>
                            </div>

                            <p className="text-xs font-bold text-black dark:text-white mt-1">
                              {suggestion.section.title}
                            </p>

                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {suggestion.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
