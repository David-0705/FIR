"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Clock,
  AlertTriangle,
  Bot,
  TrendingUp,
  BookOpen,
} from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { FIRForm } from "@/components/fir/fir-form"
import { FIRList } from "@/components/fir/fir-list"
import { FIRDetails } from "@/components/fir/fir-details"
import { ChatInterface } from "@/components/chatbot/chat-interface"
import { ChatAnalytics } from "@/components/chatbot/chat-analytics"
import { BNSReference } from "@/components/bns/bns-reference"
import type { FIR } from "@/lib/fir"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const user = getCurrentUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [firView, setFirView] = useState<"list" | "form" | "details">("list")
  const [selectedFIR, setSelectedFIR] = useState<FIR | null>(null)
  const [chatbotView, setChatbotView] = useState<"chat" | "analytics">("chat")

  const handleLogout = () => {
    logout()
    onLogout()
  }

  const handleNewFIR = () => {
    setActiveTab("firs")
    setFirView("form")
  }

  const handleFIRSuccess = () => {
    setFirView("list")
  }

  const handleViewFIR = (fir: FIR) => {
    setSelectedFIR(fir)
    setFirView("details")
  }

  const handleEditFIR = (fir: FIR) => {
    setSelectedFIR(fir)
    setFirView("form")
  }

  const handleBackToList = () => {
    setSelectedFIR(null)
    setFirView("list")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">FIR Management System</h1>
              <p className="text-sm text-muted-foreground">{user.station}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.rank} • {user.badgeNumber}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "firs", label: "FIR Management", icon: FileText },
              { id: "chatbot", label: "AI Assistant", icon: MessageSquare },
              { id: "bns", label: "BNS Reference", icon: BookOpen },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id === "firs") setFirView("list")
                    if (tab.id === "chatbot") setChatbotView("chat")
                  }}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <Button onClick={handleNewFIR}>
                <Plus className="h-4 w-4 mr-2" />
                New FIR
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total FIRs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">-5% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Complaints</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Collected via chatbot</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent FIRs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent FIRs</CardTitle>
                <CardDescription>Latest filed complaints and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "FIR001",
                      type: "Theft",
                      location: "Market Street",
                      status: "Under Investigation",
                      priority: "High",
                    },
                    {
                      id: "FIR002",
                      type: "Assault",
                      location: "Park Avenue",
                      status: "Evidence Collection",
                      priority: "Medium",
                    },
                    { id: "FIR003", type: "Fraud", location: "Business District", status: "Pending", priority: "Low" },
                  ].map((fir) => (
                    <div key={fir.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{fir.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {fir.type} • {fir.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            fir.priority === "High"
                              ? "destructive"
                              : fir.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {fir.priority}
                        </Badge>
                        <Badge variant="outline">{fir.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "firs" && (
          <div className="space-y-6">
            {firView === "list" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">FIR Management</h2>
                  <Button onClick={() => setFirView("form")}>
                    <Plus className="h-4 w-4 mr-2" />
                    New FIR
                  </Button>
                </div>
                <FIRList onViewFIR={handleViewFIR} onEditFIR={handleEditFIR} />
              </>
            )}

            {firView === "form" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedFIR ? "Edit FIR" : "Create New FIR"}</h2>
                </div>
                <FIRForm onSuccess={handleFIRSuccess} onCancel={handleBackToList} editingFIR={selectedFIR} />
              </>
            )}

            {firView === "details" && selectedFIR && (
              <FIRDetails fir={selectedFIR} onBack={handleBackToList} onEdit={() => handleEditFIR(selectedFIR)} />
            )}
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">AI Assistant</h2>
              <div className="flex space-x-2">
                <Button variant={chatbotView === "chat" ? "default" : "outline"} onClick={() => setChatbotView("chat")}>
                  <Bot className="h-4 w-4 mr-2" />
                  Chat Interface
                </Button>
                <Button
                  variant={chatbotView === "analytics" ? "default" : "outline"}
                  onClick={() => setChatbotView("analytics")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>

            {chatbotView === "chat" && <ChatInterface />}
            {chatbotView === "analytics" && <ChatAnalytics />}
          </div>
        )}

        {activeTab === "bns" && <BNSReference />}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">System settings and configuration options.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
