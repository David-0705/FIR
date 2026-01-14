"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, MapPin, Phone, User, AlertTriangle, Download, Printer, Scale } from "lucide-react"
import type { FIR } from "@/lib/fir"
import { downloadFIRPDF, printFIRPDF } from "@/lib/pdf-generator"

interface FIRDetailsProps {
  fir: FIR
  onBack: () => void
  onEdit: () => void
}

export function FIRDetails({ fir, onBack, onEdit }: FIRDetailsProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{fir.firNumber}</h2>
            <p className="text-muted-foreground">FIR Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => downloadFIRPDF(fir)}>
            <Download className="h-4 w-4 mr-2" />
            Download FIR
          </Button>
          <Button variant="outline" onClick={() => printFIRPDF(fir)}>
            <Printer className="h-4 w-4 mr-2" />
            Print FIR
          </Button>
          <Button onClick={onEdit}>Edit FIR</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complainant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Complainant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg">{fir.complainantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-lg flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {fir.complainantPhone}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-lg">{fir.complainantAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-lg">{fir.incidentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <Badge variant={getPriorityColor(fir.priority) as any} className="text-sm">
                    {fir.priority}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-lg flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {fir.incidentLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(fir.incidentDateTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-base leading-relaxed mt-2 p-4 bg-muted rounded-lg">{fir.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-transparent dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Applicable BNS Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fir.bnsSection && (
                <div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Primary Section</p>
                  <div className="p-3 bg-white dark:bg-gray-800 border-l-4 border-blue-600 rounded">
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{fir.bnsSection}</p>
                  </div>
                </div>
              )}

              {fir.bnsSections && fir.bnsSections.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    Additional Applicable Sections ({fir.bnsSections.length})
                  </p>
                  <div className="space-y-2">
                    {fir.bnsSections.map((section) => (
                      <div
                        key={section}
                        className="p-3 bg-white dark:bg-blue-800 border-l-4 border-blue-400 rounded flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/20 transition"
                      >
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{section}</span>
                        <Badge variant="secondary" className="text-xs">
                          Applicable
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!fir.bnsSection && (!fir.bnsSections || fir.bnsSections.length === 0) && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded text-muted-foreground">
                  No BNS sections have been assigned yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status & Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <Badge variant="outline" className="mt-1">
                  {fir.status}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Officer</p>
                <p className="text-lg">{fir.assignedOfficer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-lg">{fir.createdBy}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">FIR Registered</p>
                <p className="text-sm">{new Date(fir.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{new Date(fir.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">FIR Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Form Type</p>
                <p className="font-medium">Form IF1 (Integrated Form)</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Legal Framework</p>
                <p className="font-medium">BNS, 2023 / Cr.P.C Section 154</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">FIR ID</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">{fir.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
