"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Scale, Filter, ChevronDown, ChevronUp } from "lucide-react"
import {
  searchBNSSections,
  getAllBNSSectionsSorted,
  getAllBNSCategories,
  getBNSSectionsByCategory,
  type BNSSection,
} from "@/lib/bns-data"

export function BNSReference() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("search")

  const categories = useMemo(() => getAllBNSCategories(), [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchBNSSections(searchQuery)
  }, [searchQuery])

  const categoryResults = useMemo(() => {
    if (!selectedCategory) return []
    return getBNSSectionsByCategory(selectedCategory)
  }, [selectedCategory])

  const allSections = useMemo(() => getAllBNSSectionsSorted(), [])

  const BNSCard = ({
    section,
    isExpanded,
    onToggle,
  }: { section: BNSSection; isExpanded: boolean; onToggle: () => void }) => (
    <Card className="mb-3 cursor-pointer hover:bg-slate-900/50 transition-colors" onClick={onToggle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-lg text-white">{section.section_number}</h3>
                <p className="text-sm font-semibold text-blue-300 mt-1">{section.title}</p>
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">DESCRIPTION</p>
            <p className="text-sm leading-relaxed text-gray-300">{section.description}</p>
          </div>

          {section.punishment && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">PUNISHMENT</p>
              <p className="text-sm bg-red-900/30 p-3 rounded border border-red-900 text-red-200">
                {section.punishment}
              </p>
            </div>
          )}

          {section.keywords && section.keywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">KEYWORDS</p>
              <div className="flex flex-wrap gap-2">
                {section.keywords.map((keyword, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {section.cognizable && (
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-700">
              <div>
                <p className="text-xs text-gray-500">Cognizable</p>
                <p className="text-sm font-semibold text-gray-300">{section.cognizable}</p>
              </div>
              {section.bailable && (
                <div>
                  <p className="text-xs text-gray-500">Bailable</p>
                  <p className="text-sm font-semibold text-gray-300">{section.bailable}</p>
                </div>
              )}
              {section.court && (
                <div>
                  <p className="text-xs text-gray-500">Court</p>
                  <p className="text-sm font-semibold text-gray-300">{section.court}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">BNS Reference</h2>
          <p className="text-gray-400">Browse and search all Bharatiya Nyaya Sanhita sections</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>By Category</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>All Sections</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search BNS Sections
              </CardTitle>
              <CardDescription>Search by section number, title, description, keywords, or punishment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter section number (e.g., 103), keyword (e.g., murder, theft), or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border-slate-700"
                />

                {searchResults.length > 0 && (
                  <ScrollArea className="h-96">
                    <div className="space-y-2 pr-4">
                      {searchResults.map((section) => (
                        <BNSCard
                          key={section.section_number}
                          section={section}
                          isExpanded={expandedSection === section.section_number}
                          onToggle={() =>
                            setExpandedSection(
                              expandedSection === section.section_number ? null : section.section_number,
                            )
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-400">No sections found matching "{searchQuery}"</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse by Category Tab */}
        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Browse by Category
              </CardTitle>
              <CardDescription>Explore BNS sections organized by legal categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {selectedCategory && categoryResults.length > 0 && (
                  <ScrollArea className="h-96">
                    <div className="space-y-2 pr-4">
                      {categoryResults.map((section) => (
                        <BNSCard
                          key={section.section_number}
                          section={section}
                          isExpanded={expandedSection === section.section_number}
                          onToggle={() =>
                            setExpandedSection(
                              expandedSection === section.section_number ? null : section.section_number,
                            )
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {selectedCategory === null && (
                  <div className="text-center py-8 text-gray-400">Select a category to view sections</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Sections Tab */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                All BNS Sections
              </CardTitle>
              <CardDescription>
                Complete list of {allSections.length}+ Bharatiya Nyaya Sanhita sections in ascending order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2 pr-4">
                  {allSections.map((section) => (
                    <BNSCard
                      key={section.section_number}
                      section={section}
                      isExpanded={expandedSection === section.section_number}
                      onToggle={() =>
                        setExpandedSection(expandedSection === section.section_number ? null : section.section_number)
                      }
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
