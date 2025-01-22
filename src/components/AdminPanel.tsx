"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ApiService } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface TrainingMetrics {
  train_accuracy: number;
  test_accuracy: number;
  precision_class1: number;
  recall_class1: number;
  f1_class1: number;
  feature_importance: Array<{
    feature: string;
    importance: number;
  }>;
  training_details: {
    total_samples: number;
    training_time: number;
    cross_val_scores: number[];
  };
  best_params: Record<string, any>;
}

interface ModelMetrics {
  latest_metrics: TrainingMetrics | null;
  best_metrics: TrainingMetrics | null;
}

export function AdminPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_staff: false,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed' | 'error'>('idle')
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    latest_metrics: null,
    best_metrics: null
  })
  const [selectedModel, setSelectedModel] = useState<'latest' | 'best'>('latest')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
    loadModelMetrics()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await ApiService.getUsers()
      // Handle paginated response
      if (data && 'results' in data) {
        const paginatedData = data as PaginatedResponse<User>
        setUsers(paginatedData.results)
      } else {
        console.error('Received unexpected data format:', data)
        setUsers([])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      })
      setUsers([])
    }
  }

  const loadModelMetrics = async () => {
    try {
      const data = await ApiService.getModelMetrics()
      setModelMetrics({
        latest_metrics: data.latest_metrics,
        best_metrics: data.best_metrics
      })
    } catch (error) {
      console.error('Error loading model metrics:', error)
      toast({
        title: "Error",
        description: "Failed to load model metrics",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    ApiService.clearCredentials()
    router.push("/login")
  }

  const handleTraining = async () => {
    setTrainingStatus('training')
    setErrorMessage(null)
    
    try {
      const result = await ApiService.trainModel()
      setModelMetrics({
        latest_metrics: result.latest_metrics,
        best_metrics: result.best_metrics
      })
      setTrainingStatus('completed')
      
      toast({
        title: "Success",
        description: result.is_new_best 
          ? "New best model trained and saved!" 
          : "Model training completed successfully",
      })
    } catch (err) {
      console.error('Training failed:', err)
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during training')
      setTrainingStatus('error')
      
      toast({
        title: "Error",
        description: "Model training failed",
        variant: "destructive",
      })
    }
  }

  const handleCreateUser = async () => {
    try {
      await ApiService.createUser(newUser)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      setIsDialogOpen(false)
      loadUsers()
      setNewUser({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        is_staff: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const getAverageCrossValScore = (scores: number[]) => {
    if (!scores.length) return 0
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }

  const renderModelMetrics = (metrics: TrainingMetrics | null) => {
    if (!metrics || !metrics.training_details) {
      console.log('Invalid metrics data:', metrics);
      return (
        <div className="text-center py-4 text-muted-foreground">
          No model metrics available
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Model accuracy and evaluation metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Training Accuracy</span>
                <span className="text-sm">{(metrics.train_accuracy * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.train_accuracy * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Test Accuracy</span>
                <span className="text-sm">{(metrics.test_accuracy * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.test_accuracy * 100} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="space-y-1">
                <span className="text-xs font-medium">Precision</span>
                <div className="text-lg font-bold">{(metrics.precision_class1 * 100).toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium">Recall</span>
                <div className="text-lg font-bold">{(metrics.recall_class1 * 100).toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium">F1 Score</span>
                <div className="text-lg font-bold">{(metrics.f1_class1 * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Importance */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Top factors influencing churn prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              {metrics.feature_importance && metrics.feature_importance
                .sort((a, b) => b.importance - a.importance)
                .map((feature) => (
                  <div key={feature.feature} className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{feature.feature}</span>
                      <span className="text-sm">{(feature.importance * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={feature.importance * 100} />
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Training Details */}
        <Card>
          <CardHeader>
            <CardTitle>Training Details</CardTitle>
            <CardDescription>Model parameters and training information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Samples</span>
                  <Badge variant="secondary">{metrics.training_details.total_samples}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Training Time</span>
                  <Badge variant="secondary">{metrics.training_details.training_time.toFixed(2)}s</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cross-Val Score</span>
                  <Badge variant="secondary">
                    {(getAverageCrossValScore(metrics.training_details.cross_val_scores) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Best Parameters</h4>
                <ScrollArea className="h-[100px]">
                  <div className="space-y-1">
                    {metrics.best_params && Object.entries(metrics.best_params).map(([param, value]) => (
                      <div key={param} className="text-xs">
                        <span className="font-medium">{param}:</span> {value}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderTrainingMetrics = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Model Management</h2>
            <p className="text-sm text-muted-foreground">Train and monitor the churn prediction model</p>
          </div>
          <Button 
            onClick={handleTraining} 
            disabled={trainingStatus === 'training'}
            className="min-w-[120px]"
          >
            {trainingStatus === 'training' ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Training
              </>
            ) : (
              'Train Model'
            )}
          </Button>
        </div>

        <Tabs value={selectedModel} onValueChange={(value) => setSelectedModel(value as 'latest' | 'best')}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="latest">Latest Model</TabsTrigger>
            <TabsTrigger value="best">Best Model</TabsTrigger>
          </TabsList>
          <TabsContent value="latest">
            {modelMetrics.latest_metrics ? (
              renderModelMetrics(modelMetrics.latest_metrics)
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No model metrics available
              </div>
            )}
          </TabsContent>
          <TabsContent value="best">
            {modelMetrics.best_metrics ? (
              renderModelMetrics(modelMetrics.best_metrics)
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No best model metrics available
              </div>
            )}
          </TabsContent>
        </Tabs>

        {trainingStatus === 'error' && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Training Failed</CardTitle>
              <CardDescription>An error occurred during model training</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{errorMessage}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid gap-8">
        {/* User Management */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">User Management</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newUser.is_staff}
                      onChange={(e) => setNewUser({ ...newUser, is_staff: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">Admin User</label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreateUser}>Create User</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                      <TableCell>{user.is_staff ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Model Training */}
        <div className="space-y-6">
          {renderTrainingMetrics()}
        </div>
      </div>
    </div>
  )
} 