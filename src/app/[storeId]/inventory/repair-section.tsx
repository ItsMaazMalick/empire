"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Home,
  Smartphone,
  Layers,
  Settings,
  PenToolIcon as Tool,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Type definitions based on the schema
interface RepairService {
  id: string;
  name: string;
  stock: number;
  cost: number;
  price: number;
}

interface RepairServiceType {
  id: string;
  name: string;
  repairServices: RepairService[];
}

interface RepairModel {
  id: string;
  name: string;
  repairServiceType: RepairServiceType[];
}

interface RepairSeries {
  id: string;
  name: string;
  models: RepairModel[];
}

interface RepairBrand {
  id: string;
  name: string;
  repairSeries: RepairSeries[];
}

export function Inventory({ mockData }: any) {
  const [brands, setBrands] = useState<RepairBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedServiceTypes, setExpandedServiceTypes] = useState<
    Record<string, boolean>
  >({});
  const [selectedView, setSelectedView] = useState<"tree" | "table">("tree");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setBrands(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  // Toggle expanded state for brands
  const toggleBrand = (brandId: string) => {
    setExpandedBrands((prev) => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  };

  // Toggle expanded state for series
  const toggleSeries = (seriesId: string) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  };

  // Toggle expanded state for models
  const toggleModel = (modelId: string) => {
    setExpandedModels((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
  };

  // Toggle expanded state for service types
  const toggleServiceType = (serviceTypeId: string) => {
    setExpandedServiceTypes((prev) => ({
      ...prev,
      [serviceTypeId]: !prev[serviceTypeId],
    }));
  };

  // Get stock status color
  const getStockStatusColor = (stock: number) => {
    if (stock <= 0) return "text-red-500 bg-red-50";
    if (stock < 10) return "text-amber-500 bg-amber-50";
    return "text-green-500 bg-green-50";
  };

  // Get stock status text
  const getStockStatusText = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  // Get stock status icon
  const getStockStatusIcon = (stock: number) => {
    if (stock <= 0) return <AlertTriangle className="h-4 w-4" />;
    if (stock < 10) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  // Filter data based on search query
  const filteredBrands = brands.filter((brand) => {
    if (brand.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return true;

    const hasSeries = brand.repairSeries.some((series) => {
      if (series.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return true;

      const hasModels = series.models.some((model) => {
        if (model.name.toLowerCase().includes(searchQuery.toLowerCase()))
          return true;

        const hasServiceTypes = model.repairServiceType.some((serviceType) => {
          if (
            serviceType.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
            return true;

          return serviceType.repairServices.some((service) =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        return hasModels || hasServiceTypes;
      });

      return hasSeries || hasModels;
    });

    return hasSeries;
  });

  // Calculate total services and total stock for a brand
  const getBrandStats = (brand: RepairBrand) => {
    let totalServices = 0;
    let totalStock = 0;
    let totalValue = 0;

    brand.repairSeries.forEach((series) => {
      series.models.forEach((model) => {
        model.repairServiceType.forEach((serviceType) => {
          serviceType.repairServices.forEach((service) => {
            totalServices++;
            totalStock += service.stock;
            totalValue += service.stock * service.price;
          });
        });
      });
    });

    return { totalServices, totalStock, totalValue };
  };

  // Get all services as a flat list for table view
  const getAllServices = () => {
    const services: Array<{
      id: string;
      name: string;
      stock: number;
      cost: number;
      price: number;
      brand: string;
      series: string;
      model: string;
      serviceType: string;
    }> = [];

    brands.forEach((brand) => {
      brand.repairSeries.forEach((series) => {
        series.models.forEach((model) => {
          model.repairServiceType.forEach((serviceType) => {
            serviceType.repairServices.forEach((service) => {
              services.push({
                ...service,
                brand: brand.name,
                series: series.name,
                model: model.name,
                serviceType: serviceType.name,
              });
            });
          });
        });
      });
    });

    return services;
  };

  // Filter services for table view
  const getFilteredServices = () => {
    let services = getAllServices();

    if (selectedBrand) {
      services = services.filter(
        (service) =>
          service.brand === brands.find((b) => b.id === selectedBrand)?.name
      );
    }

    if (selectedSeries) {
      services = services.filter(
        (service) =>
          service.series ===
          brands
            .flatMap((b) => b.repairSeries)
            .find((s) => s.id === selectedSeries)?.name
      );
    }

    if (selectedModel) {
      services = services.filter(
        (service) =>
          service.model ===
          brands
            .flatMap((b) => b.repairSeries)
            .flatMap((s) => s.models)
            .find((m) => m.id === selectedModel)?.name
      );
    }

    if (selectedServiceType) {
      services = services.filter(
        (service) =>
          service.serviceType ===
          brands
            .flatMap((b) => b.repairSeries)
            .flatMap((s) => s.models)
            .flatMap((m) => m.repairServiceType)
            .find((st) => st.id === selectedServiceType)?.name
      );
    }

    if (searchQuery) {
      services = services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return services;
  };

  // Calculate overall inventory stats
  const getOverallStats = () => {
    let totalServices = 0;
    let totalStock = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    brands.forEach((brand) => {
      brand.repairSeries.forEach((series) => {
        series.models.forEach((model) => {
          model.repairServiceType.forEach((serviceType) => {
            serviceType.repairServices.forEach((service) => {
              totalServices++;
              totalStock += service.stock;
              totalValue += service.stock * service.price;

              if (service.stock === 0) outOfStockCount++;
              else if (service.stock < 10) lowStockCount++;
            });
          });
        });
      });
    });

    return {
      totalServices,
      totalStock,
      totalValue,
      lowStockCount,
      outOfStockCount,
    };
  };

  const stats = getOverallStats();

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>Repair Services</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    Total Services
                  </div>
                </div>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <Package className="h-4 w-4" />
                  Unique repair services
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    Total Stock
                  </div>
                </div>
                <div className="text-2xl font-bold">{stats.totalStock}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <Package className="h-4 w-4" />
                  Items in inventory
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    Inventory Value
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  ${stats.totalValue.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <Package className="h-4 w-4" />
                  Retail value
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Low Stock</div>
                </div>
                <div className="text-2xl font-bold text-amber-500">
                  {stats.lowStockCount}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Services with low stock
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    Out of Stock
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {stats.outOfStockCount}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Services out of stock
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Repair Services Inventory</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedView === "tree" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedView("tree")}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Hierarchy View
                  </Button>
                  <Button
                    variant={selectedView === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedView("table")}
                  >
                    <Table className="mr-2 h-4 w-4" />
                    Table View
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage your repair services inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services, brands, models..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {selectedView === "tree" ? (
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeletons
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-5 w-40" />
                          </div>
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ))
                  ) : filteredBrands.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        No results found
                      </div>
                      <Button variant="link" onClick={() => setSearchQuery("")}>
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    // Brand level
                    filteredBrands.map((brand) => (
                      <Card key={brand.id} className="overflow-hidden">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleBrand(brand.id)}
                        >
                          <div className="flex items-center gap-2">
                            {expandedBrands[brand.id] ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Smartphone className="h-5 w-5 text-primary" />
                            <span className="font-medium">{brand.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-normal">
                              {brand.repairSeries.length} Series
                            </Badge>
                            <Badge variant="outline" className="font-normal">
                              {getBrandStats(brand).totalServices} Services
                            </Badge>
                            <Badge variant="outline" className="font-normal">
                              {getBrandStats(brand).totalStock} Items
                            </Badge>
                          </div>
                        </div>

                        {expandedBrands[brand.id] && (
                          <div className="border-t">
                            {/* Series level */}
                            {brand.repairSeries.map((series) => (
                              <div key={series.id}>
                                <div
                                  className="flex items-center justify-between p-3 pl-8 cursor-pointer hover:bg-gray-50 border-b"
                                  onClick={() => toggleSeries(series.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    {expandedSeries[series.id] ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <Smartphone className="h-4 w-4 text-blue-500" />
                                    <span>{series.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      {series.models.length} Models
                                    </Badge>
                                  </div>
                                </div>

                                {expandedSeries[series.id] && (
                                  <div>
                                    {/* Model level */}
                                    {series.models.map((model) => (
                                      <div key={model.id}>
                                        <div
                                          className="flex items-center justify-between p-3 pl-12 cursor-pointer hover:bg-gray-50 border-b"
                                          onClick={() => toggleModel(model.id)}
                                        >
                                          <div className="flex items-center gap-2">
                                            {expandedModels[model.id] ? (
                                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <Settings className="h-4 w-4 text-purple-500" />
                                            <span>{model.name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant="outline"
                                              className="font-normal"
                                            >
                                              {model.repairServiceType.length}{" "}
                                              Service Types
                                            </Badge>
                                          </div>
                                        </div>

                                        {expandedModels[model.id] && (
                                          <div>
                                            {/* Service Type level */}
                                            {model.repairServiceType.map(
                                              (serviceType) => (
                                                <div key={serviceType.id}>
                                                  <div
                                                    className="flex items-center justify-between p-3 pl-16 cursor-pointer hover:bg-gray-50 border-b"
                                                    onClick={() =>
                                                      toggleServiceType(
                                                        serviceType.id
                                                      )
                                                    }
                                                  >
                                                    <div className="flex items-center gap-2">
                                                      {expandedServiceTypes[
                                                        serviceType.id
                                                      ] ? (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                      ) : (
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                      )}
                                                      <Tool className="h-4 w-4 text-orange-500" />
                                                      <span>
                                                        {serviceType.name}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <Badge
                                                        variant="outline"
                                                        className="font-normal"
                                                      >
                                                        {
                                                          serviceType
                                                            .repairServices
                                                            .length
                                                        }{" "}
                                                        Services
                                                      </Badge>
                                                    </div>
                                                  </div>

                                                  {expandedServiceTypes[
                                                    serviceType.id
                                                  ] && (
                                                    <div className="bg-gray-50">
                                                      {/* Service level */}
                                                      <div className="p-3 pl-20">
                                                        <Table>
                                                          <TableHeader>
                                                            <TableRow>
                                                              <TableHead>
                                                                Service
                                                              </TableHead>
                                                              <TableHead>
                                                                Stock
                                                              </TableHead>
                                                              <TableHead>
                                                                Cost
                                                              </TableHead>
                                                              <TableHead>
                                                                Price
                                                              </TableHead>
                                                              <TableHead>
                                                                Status
                                                              </TableHead>
                                                            </TableRow>
                                                          </TableHeader>
                                                          <TableBody>
                                                            {serviceType.repairServices.map(
                                                              (service) => (
                                                                <TableRow
                                                                  key={
                                                                    service.id
                                                                  }
                                                                >
                                                                  <TableCell className="font-medium">
                                                                    {
                                                                      service.name
                                                                    }
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {
                                                                      service.stock
                                                                    }
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    $
                                                                    {service.cost.toFixed(
                                                                      2
                                                                    )}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    $
                                                                    {service.price.toFixed(
                                                                      2
                                                                    )}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Badge
                                                                      variant="outline"
                                                                      className={`flex items-center gap-1 ${getStockStatusColor(
                                                                        service.stock
                                                                      )}`}
                                                                    >
                                                                      {getStockStatusIcon(
                                                                        service.stock
                                                                      )}
                                                                      {getStockStatusText(
                                                                        service.stock
                                                                      )}
                                                                    </Badge>
                                                                  </TableCell>
                                                                </TableRow>
                                                              )
                                                            )}
                                                          </TableBody>
                                                        </Table>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                // Table view
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Select
                      value={selectedBrand || ""}
                      onValueChange={setSelectedBrand}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defaultBrand">All Brands</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedSeries || ""}
                      onValueChange={setSelectedSeries}
                      disabled={!selectedBrand}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Series" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defaultSeries">
                          All Series
                        </SelectItem>
                        {selectedBrand &&
                          brands
                            .find((b) => b.id === selectedBrand)
                            ?.repairSeries.map((series) => (
                              <SelectItem key={series.id} value={series.id}>
                                {series.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedModel || ""}
                      onValueChange={setSelectedModel}
                      disabled={!selectedSeries}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Models" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defaultModel">All Models</SelectItem>
                        {selectedSeries &&
                          brands
                            .flatMap((b) => b.repairSeries)
                            .find((s) => s.id === selectedSeries)
                            ?.models.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedServiceType || ""}
                      onValueChange={setSelectedServiceType}
                      disabled={!selectedModel}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Service Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defaultServiceType">
                          All Service Types
                        </SelectItem>
                        {selectedModel &&
                          brands
                            .flatMap((b) => b.repairSeries)
                            .flatMap((s) => s.models)
                            .find((m) => m.id === selectedModel)
                            ?.repairServiceType.map((serviceType) => (
                              <SelectItem
                                key={serviceType.id}
                                value={serviceType.id}
                              >
                                {serviceType.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Series</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-10" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-4 w-20" />
                                </TableCell>
                              </TableRow>
                            ))
                        ) : getFilteredServices().length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={10}
                              className="text-center py-4"
                            >
                              <div className="text-muted-foreground">
                                No services found
                              </div>
                              <Button
                                variant="link"
                                onClick={() => {
                                  setSearchQuery("");
                                  setSelectedBrand(null);
                                  setSelectedSeries(null);
                                  setSelectedModel(null);
                                  setSelectedServiceType(null);
                                }}
                              >
                                Clear filters
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          getFilteredServices().map((service) => (
                            <TableRow key={service.id}>
                              <TableCell className="font-medium">
                                {service.name}
                              </TableCell>
                              <TableCell>{service.brand}</TableCell>
                              <TableCell>{service.series}</TableCell>
                              <TableCell>{service.model}</TableCell>
                              <TableCell>{service.serviceType}</TableCell>
                              <TableCell>{service.stock}</TableCell>
                              <TableCell>${service.cost.toFixed(2)}</TableCell>
                              <TableCell>${service.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`flex items-center gap-1 ${getStockStatusColor(
                                    service.stock
                                  )}`}
                                >
                                  {getStockStatusIcon(service.stock)}
                                  {getStockStatusText(service.stock)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredServices().length} of{" "}
                {getAllServices().length} services
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
