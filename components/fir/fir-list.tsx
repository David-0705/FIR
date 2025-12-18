"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Edit, Loader2 } from "lucide-react"
import { getAllFIRs, updateFIRStatus, type FIR } from "@/lib/fir"

interface FIRListProps {
  onViewFIR: (fir: FIR) => void
  onEditFIR: (fir: FIR) => void
}

export function FIRList({ onViewFIR, onEditFIR }: FIRListProps) {
  const [firs, setFirs] = useState<FIR[]>([])
  const [filteredFirs, setFilteredFirs] = useState<FIR[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    loadFIRs()
  }, [])

  useEffect(() => {
    filterFIRs()
  }, [firs, searchQuery, statusFilter, priorityFilter])

  const loadFIRs = async () => {
    try {
      const data = await getAllFIRs()
      setFirs(data)
    } catch (error) {
      console.error("Failed to load FIRs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterFIRs = () => {
    let filtered = [...firs]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (fir) =>
          fir.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fir.complainantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fir.incidentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fir.incidentLocation.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((fir) => fir.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((fir) => fir.priority === priorityFilter)
    }

    setFilteredFirs(filtered)
  }

  const handleStatusUpdate = async (firId: string, newStatus: FIR["status"]) => {
    try {
      await updateFIRStatus(firId, newStatus)
      await loadFIRs() // Reload to get updated data
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registered":
        return "default"
      case "Under Investigation":
        return "default"
      case "Evidence Collection":
        return "secondary"
      case "Pending":
        return "secondary"
      case "Closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading FIRs...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific FIRs using search and filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by FIR number, complainant, type, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Registered">Registered</SelectItem>
                <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                <SelectItem value="Evidence Collection">Evidence Collection</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* FIR Table */}
      <Card>
        <CardHeader>
          <CardTitle>FIR Records ({filteredFirs.length})</CardTitle>
          <CardDescription>Manage and track all registered FIRs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FIR Number</TableHead>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Incident Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFirs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No FIRs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFirs.map((fir) => (
                    <TableRow key={fir.id}>
                      <TableCell className="font-medium">{fir.firNumber}</TableCell>
                      <TableCell>{fir.complainantName}</TableCell>
                      <TableCell>{fir.incidentType}</TableCell>
                      <TableCell className="max-w-32 truncate">{fir.incidentLocation}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(fir.priority) as any}>{fir.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={fir.status}
                          onValueChange={(value) => handleStatusUpdate(fir.id, value as FIR["status"])}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Registered">Registered</SelectItem>
                            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                            <SelectItem value="Evidence Collection">Evidence Collection</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(fir.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => onViewFIR(fir)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onEditFIR(fir)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
