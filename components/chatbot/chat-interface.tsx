"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, RefreshCw, MessageSquare, Download, Eye, Mic, MicOff, Volume2, Globe } from "lucide-react"
import { chatbotService, type ChatMessage, type ChatSession } from "@/lib/chatbot"
import { downloadFIRPDF } from "@/lib/pdf-generator"
import { getFIRById } from "@/lib/fir"
import { VoiceService, textToSpeech, getTransliteration } from "@/lib/voice-service"
import { type LanguageCode, getTranslation, languageNames } from "@/lib/languages"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ChatInterface() {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [voiceService, setVoiceService] = useState<VoiceService | null>(null)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en")
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [voiceTranscriptTranslation, setVoiceTranscriptTranslation] = useState("")

  // --- EDIT MODE STATES ---
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const service = new VoiceService(currentLanguage)
    setVoiceService(service)

    return () => {
      if (service.getIsListening()) {
        service.stopListening()
      }
    }
  }, [currentLanguage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const startVoiceInput = () => {
    if (!voiceService) return

    setIsVoiceListening(true)
    setVoiceTranscript("")
    setVoiceTranscriptTranslation("")

    voiceService.startListening(
      (transcript, isFinal) => {
        setVoiceTranscript(transcript)

        if (isFinal) {
          setInputValue(transcript)

          if (currentLanguage !== "en" && transcript.length > 0) {
            getTransliteration(transcript, currentLanguage)
              .then((translation) => {
                setVoiceTranscriptTranslation(translation)
              })
              .catch((error) => {
                console.error("[v0] Translation fetch error:", error)
              })
          }
        }
      },
      (error) => {
        console.error("[v0] Voice error:", error)
        alert(error)
        setIsVoiceListening(false)
      },
      () => {
        setIsVoiceListening(false)
      },
    )
  }

  const stopVoiceInput = () => {
    if (voiceService) {
      voiceService.stopListening()
      setIsVoiceListening(false)
    }
  }

  const handleLanguageChange = (language: LanguageCode) => {
    setCurrentLanguage(language)
    if (voiceService) {
      voiceService.setLanguage(language)
    }
  }

  const startNewSession = () => {
    const newSession = chatbotService.createSession()
    setSession(newSession)
    setMessages(newSession.messages)
    if (newSession.messages.length > 0) {
      textToSpeech(newSession.messages[0].content, currentLanguage)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session || isLoading) return

    setIsLoading(true)
    const userMessage = inputValue.trim()
    setInputValue("")
    setVoiceTranscript("")
    setVoiceTranscriptTranslation("")

    try {
      if (isEditing && editingField) {
        // --- EDIT MODE LOGIC ---
        const updatedSession = chatbotService.updateField(session.id, editingField, userMessage)

        const confirmationMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "bot",
          content: `${editingField.replace("_", " ")} updated successfully!`,
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, confirmationMessage])
        setSession(updatedSession)

        // Reset edit mode
        setIsEditing(false)
        setEditingField(null)
        return
      }

      // --- NORMAL FLOW ---
      const updatedMessages = await chatbotService.processMessage(session.id, userMessage)
      setMessages(updatedMessages)

      const updatedSession = chatbotService.getSession(session.id)
      if (updatedSession) {
        setSession(updatedSession)
        const lastMessage = updatedMessages[updatedMessages.length - 1]
        if (lastMessage && lastMessage.type === "bot") {
          textToSpeech(lastMessage.content, currentLanguage)
        }
      }
    } catch (error) {
      console.error("Error processing message:", error)
      // ✅ Removed sending error message to chat
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  const getStepBadge = (step: string) => {
    const stepLabels: Record<string, string> = {
      greeting: "Welcome",
      name: "Personal Info",
      phone: "Contact",
      address: "Address",
      incident_type: "Incident Type",
      location: "Location",
      date_time: "Date & Time",
      description: "Description",
      priority: "Priority",
      confirmation: "Review",
      completed: "Completed",
    }
    return stepLabels[step] || step
  }

  const handleDownloadFIR = async () => {
    if (!session?.isCompleted || !session.createdFIRId) return

    try {
      const fir = await getFIRById(session.createdFIRId)
      if (fir) {
        await downloadFIRPDF(fir)
      }
    } catch (error) {
      console.error("Error downloading FIR:", error)
      alert("Failed to download FIR PDF. Please try again.")
    }
  }

  const handlePreviewFIR = async () => {
    if (!session?.isCompleted || !session.createdFIRId) return

    try {
      const fir = await getFIRById(session.createdFIRId)
      if (fir) {
        const blob = await downloadFIRPDF(fir)
        const url = window.URL.createObjectURL(blob)
        window.open(url, "_blank")
      }
    } catch (error) {
      console.error("Error previewing FIR:", error)
      alert("Failed to preview FIR PDF. Please try again.")
    }
  }

  useEffect(() => {
    startNewSession()
  }, [])

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>AI Complaint Assistant</span>
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  {session && (
                    <Badge variant="outline" className="text-xs">
                      {getStepBadge(session.currentStep)}
                    </Badge>
                  )}
                  {session?.isCompleted && (
                    <Badge variant="default" className="text-xs bg-green-600">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 items-center">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{languageNames.en}</SelectItem>
                    <SelectItem value="hi">{languageNames.hi}</SelectItem>
                    <SelectItem value="mr">{languageNames.mr}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {session?.isCompleted && (
                <>
                  <Button variant="outline" size="sm" onClick={handlePreviewFIR}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview FIR
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownloadFIR}>
                    <Download className="h-4 w-4 mr-2" />
                    Download FIR
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={startNewSession}>
                <RefreshCw className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                    >
                      {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{formatMessageContent(message.content)}</div>
                    <div className="text-xs opacity-70 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    {message.type === "bot" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-6 px-2"
                        onClick={() => textToSpeech(message.content, currentLanguage)}
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Speak
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="space-y-2">
              {voiceTranscript && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-blue-900 block mb-1">
                      {currentLanguage === "en" ? "Voice Input:" : `${languageNames[currentLanguage]} Input:`}
                    </span>
                    <span className="text-blue-900 font-medium text-lg">{voiceTranscript}</span>
                  </div>
                  {voiceTranscriptTranslation && (
                    <div className="border-t border-blue-200 pt-2">
                      <span className="text-xs font-semibold text-blue-700 block mb-1">English Translation:</span>
                      <span className="text-blue-700 text-sm">{voiceTranscriptTranslation}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading || isVoiceListening}
                  className="flex-1"
                />
                <Button
                  onClick={isVoiceListening ? stopVoiceInput : startVoiceInput}
                  variant={isVoiceListening ? "destructive" : "outline"}
                  size="icon"
                  title={isVoiceListening ? "Stop listening" : "Start voice input"}
                >
                  {isVoiceListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Click 🎤 for voice input • This AI assistant will help you file a complaint step by
              step
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
