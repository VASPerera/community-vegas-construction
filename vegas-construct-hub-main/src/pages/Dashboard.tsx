import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "../components/dashboard/TaskManager";
import EmployeeManager from "../components/dashboard/EmployeeManager";
import EquipmentManager from "../components/dashboard/EquipmentManager";
import BudgetManager from "../components/dashboard/BudgetManager";
import axios from "axios";
import { ProjectDashboardContext } from "@/lib/context/projectContext";

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  budget: number;
  spent: number;
  startDate: string;
  // endDate: string;
  status: "Active";
  progress: number;
}

export interface ProjectStatistics {
  projectProgress: number;
  budgetUsed: number;
  activeTasks: number;
  equipmentCount: number;
}

const Dashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [taskLenth, setTaskLenth] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [project, setProject] = useState<Project>({
    id: "",
    name: "",
    description: "No description provided.",
    location: "",
    budget: 0,
    spent: 0,
    startDate: "",
    status: "Active",
    progress: 0,
  });

  const [projectStatistics, setProjectStatistics] = useState<ProjectStatistics>({
    projectProgress: 0,
    budgetUsed: 0,
    activeTasks: 0,
    equipmentCount: 0,
  });

  // Mock project data - in real app this would come from API
  //   const [project, setProject] = useState(
  //     {
  //     id: projectId,
  //     name: "Vegas Strip Casino Renovation",
  //     description:
  //       "Complete renovation of the main casino floor including new gaming areas and restaurants.",
  //     location: "Las Vegas Strip",
  //     budget: 25000000,
  //     spent: 16250000,
  //     startDate: "2024-01-15",
  //     endDate: "2024-12-31",
  //     status: "In Progress",
  //     progress: 65,
  //   }
  // );

  const [activeTab, setActiveTab] = useState("overview");

  const handleBack = () => {
    navigate("/projects");
  };

  const budgetPercentage = (project.spent / project.budget) * 100;
  const remainingBudget = project.budget - project.spent;

  const getProject = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/project/projects/${projectId}`
      );
      // console.log(response.data.project);

      const data = response.data.project;

      setProject({
        id: data._id,
        name: data.projectName,
        description: data.description || "No description provided.",
        location: data.location,
        budget: data.budget,
        spent: 0, // default to 0 if not available
        startDate: data.startDate?.split("T")[0] || "",
        status: "Active",
        progress: 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAgentData = async () => {
    try {
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        console.error("Agent ID not found in localStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/agent/get-agent/${agentId}`
      );
      // console.log(response.data.firstName);

      const name = response.data.firstName;

      setAgentName(name);
      // Do something with response.data
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  // const fetchNumberOfTask = async () => {
  //   try {
  //     const savedCount = localStorage.getItem("taskCount");
  //     if (savedCount) {
  //       setTaskLenth(parseInt(savedCount)); // Set it to the state if it's available
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchAgentData();
    getProject();
    // fetchNumberOfTask();
  }, []);

  return (
    <ProjectDashboardContext.Provider value={projectStatistics}>
      
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg"></div>
                <h1 className="text-xl font-bold text-gray-900">
                  {project.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>{agentName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Project Progress
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStatistics.projectProgress}%</div>
              <Progress value={projectStatistics.projectProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${project.spent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${remainingBudget.toLocaleString()} remaining
              </p>
              <Progress value={projectStatistics.budgetUsed} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tasks
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStatistics.activeTasks}</div>
              <p className="text-xs text-muted-foreground">
                8 completed this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStatistics.equipmentCount}</div>
              <p className="text-xs text-muted-foreground">
                3 under maintenance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Location
                    </label>
                    <p className="text-gray-900">{project.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-gray-900">{project.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Start Date
                      </label>
                      <p className="text-gray-900">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        End Date
                      </label>
                      {/* <p className="text-gray-900">
                        {new Date(project.endDate).toLocaleDateString()}
                      </p> */}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {project.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">
                          Foundation work completed
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">
                          New equipment delivery scheduled
                        </p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">
                          Budget review meeting scheduled
                        </p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentManager />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProjectDashboardContext.Provider>
  );
};

export default Dashboard;
