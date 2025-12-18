"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, CheckCircle, Clock, Eye, TrendingUp } from "lucide-react"
import { chatbotService, type ComplaintData } from "@/lib/chatbot"

export function ChatAnalytics() {
  const [completedComplaints, setCompletedComplaints] = useState<ComplaintData[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    const complaints = chatbotService.getCompletedComplaints()
    setCompletedComplaints(complaints)
  }

  const getIncidentTypeStats = () => {
    const stats: Record<string, number> = {}
    completedComplaints.forEach((complaint) => {
      stats[complaint.incidentType] = (stats[complaint.incidentType] || 0) + 1
    })
    return Object.entries(stats).sort(([, a], [, b]) => b - a)
  }

  const getPriorityStats = () => {
    const stats: Record<string, number> = {}
    completedComplaints.forEach((complaint) => {
      stats[complaint.priority] = (stats[complaint.priority] || 0) + 1
    })
    return stats
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

  if (selectedComplaint) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Complaint Details</h3>
          <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
            Back to Analytics
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Information</CardTitle>
            <CardDescription>Details collected through AI assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complainant Name</p>
                <p className="text-lg">{selectedComplaint.complainantName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p className="text-lg">{selectedComplaint.complainantPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incident Type</p>
                <p className="text-lg">{selectedComplaint.incidentType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge variant={getPriorityColor(selectedComplaint.priority) as any}>
                  {selectedComplaint.priority}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-base">{selectedComplaint.complainantAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Incident Location</p>
              <p className="text-base">{selectedComplaint.incidentLocation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Incident Date & Time</p>
              <p className="text-base">{new Date(selectedComplaint.incidentDateTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-base leading-relaxed p-4 bg-muted rounded-lg">{selectedComplaint.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const incidentStats = getIncidentTypeStats()
  const priorityStats = getPriorityStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Assistant Analytics</h3>
        <Button variant="outline" onClick={loadAnalytics}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedComplaints.length}</div>
            <p className="text-xs text-muted-foreground">Collected via AI assistant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(priorityStats.High || 0) + (priorityStats.Critical || 0)}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidentStats[0]?.[1] || 0}</div>
            <p className="text-xs text-muted-foreground">{incidentStats[0]?.[0] || "N/A"} incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Users complete the process</p>
          </CardContent>
        </Card>
      </div>

      {/* Incident Types Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Types</CardTitle>
            <CardDescription>Distribution of complaint types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidentStats.slice(0, 6).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / completedComplaints.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Complaint priority levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(priority) as any} className="w-16 justify-center">
                      {priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / completedComplaints.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI-Collected Complaints</CardTitle>
          <CardDescription>Complaints submitted through the AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          {completedComplaints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No complaints collected yet. Users can interact with the AI assistant to file complaints.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Incident Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedComplaints.slice(0, 10).map((complaint, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{complaint.complainantName}</TableCell>
                    <TableCell>{complaint.incidentType}</TableCell>
                    <TableCell className="max-w-32 truncate">{complaint.incidentLocation}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(complaint.priority) as any}>{complaint.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
