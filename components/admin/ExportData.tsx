"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, FileText, Database } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ExportData() {
  const [exportType, setExportType] = useState("users")
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would call your API endpoints
      // For now, we'll just simulate the export
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Export Successful",
        description: `Your ${exportType} data has been exported successfully.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Export
        </CardTitle>
        <CardDescription>
          Export your data in various formats for analysis or backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="campaigns">Campaigns</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                <SelectItem value="blog-posts">Blog Posts</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleExport} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {loading ? "Exporting..." : "Export"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export as CSV</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Export as JSON</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}