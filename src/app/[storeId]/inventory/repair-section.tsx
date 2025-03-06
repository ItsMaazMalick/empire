"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
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
import { getAllRepairBrandswithSeriesModalInventory } from "@/actions/repair";
import { useDebounce } from "@/lib/hooks/debounce";

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

// Constants for pagination
const ITEMS_PER_PAGE = 20;

export function Inventory() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isChangingView, setIsChangingView] = useState(false);

  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllRepairBrandswithSeriesModalInventory();
        if (data) {
          setBrands(data);
        }
      } catch (error) {
        console.error("Error fetching repair services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle expanded state for brands - memoized to prevent recreating on each render
  const toggleBrand = useCallback((brandId: string) => {
    setExpandedBrands((prev) => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  }, []);

  // Toggle expanded state for series
  const toggleSeries = useCallback((seriesId: string) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  }, []);

  // Toggle expanded state for models
  const toggleModel = useCallback((modelId: string) => {
    setExpandedModels((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
  }, []);

  // Toggle expanded state for service types
  const toggleServiceType = useCallback((serviceTypeId: string) => {
    setExpandedServiceTypes((prev) => ({
      ...prev,
      [serviceTypeId]: !prev[serviceTypeId],
    }));
  }, []);

  // Handle view change with transition state
  const handleViewChange = (view: "tree" | "table") => {
    if (selectedView !== view) {
      setIsChangingView(true);
      // Small delay to allow for transition
      setTimeout(() => {
        setSelectedView(view);
        setIsChangingView(false);
      }, 100);
    }
  };

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedSeries(null);
    setSelectedModel(null);
    setSelectedServiceType(null);
    setCurrentPage(1);
  }, []);

  // Get stock status color
  const getStockStatusColor = useCallback((stock: number) => {
    if (stock <= 0) return "text-red-500 bg-red-50";
    if (stock < 10) return "text-amber-500 bg-amber-50";
    return "text-green-500 bg-green-50";
  }, []);

  // Get stock status text
  const getStockStatusText = useCallback((stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  }, []);

  // Get stock status icon
  const getStockStatusIcon = useCallback((stock: number) => {
    if (stock <= 0) return <AlertTriangle className="h-4 w-4" />;
    if (stock < 10) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  }, []);

  // Memoized filtered brands for tree view
  const filteredBrands = useMemo(() => {
    if (!debouncedSearchQuery) return brands;

    return brands.filter((brand) => {
      if (brand.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
        return true;

      const hasSeries = brand.repairSeries.some((series) => {
        if (
          series.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
          return true;

        const hasModels = series.models.some((model) => {
          if (
            model.name
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
            return true;

          const hasServiceTypes = model.repairServiceType.some(
            (serviceType) => {
              if (
                serviceType.name
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())
              )
                return true;

              return serviceType.repairServices.some((service) =>
                service.name
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())
              );
            }
          );

          return hasModels || hasServiceTypes;
        });

        return hasSeries || hasModels;
      });

      return hasSeries;
    });
  }, [brands, debouncedSearchQuery]);

  // Memoized brand stats calculation
  const getBrandStats = useCallback((brand: RepairBrand) => {
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
  }, []);

  // Memoized flat list of all services for table view
  const allServices = useMemo(() => {
    const services: Array<{
      id: string;
      name: string;
      stock: number;
      cost: number;
      price: number;
      brand: string;
      brandId: string;
      series: string;
      seriesId: string;
      model: string;
      modelId: string;
      serviceType: string;
      serviceTypeId: string;
    }> = [];

    brands.forEach((brand) => {
      brand.repairSeries.forEach((series) => {
        series.models.forEach((model) => {
          model.repairServiceType.forEach((serviceType) => {
            serviceType.repairServices.forEach((service) => {
              services.push({
                ...service,
                brand: brand.name,
                brandId: brand.id,
                series: series.name,
                seriesId: series.id,
                model: model.name,
                modelId: model.id,
                serviceType: serviceType.name,
                serviceTypeId: serviceType.id,
              });
            });
          });
        });
      });
    });

    return services;
  }, [brands]);

  // Memoized filtered services for table view
  const filteredServices = useMemo(() => {
    let services = [...allServices];

    if (selectedBrand) {
      services = services.filter(
        (service) => service.brandId === selectedBrand
      );
    }

    if (selectedSeries) {
      services = services.filter(
        (service) => service.seriesId === selectedSeries
      );
    }

    if (selectedModel) {
      services = services.filter(
        (service) => service.modelId === selectedModel
      );
    }

    if (selectedServiceType) {
      services = services.filter(
        (service) => service.serviceTypeId === selectedServiceType
      );
    }

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      services = services.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.brand.toLowerCase().includes(query) ||
          service.series.toLowerCase().includes(query) ||
          service.model.toLowerCase().includes(query) ||
          service.serviceType.toLowerCase().includes(query)
      );
    }

    return services;
  }, [
    allServices,
    selectedBrand,
    selectedSeries,
    selectedModel,
    selectedServiceType,
    debouncedSearchQuery,
  ]);

  // Paginated services for table view
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(filteredServices.length / ITEMS_PER_PAGE),
    [filteredServices]
  );

  // Memoized overall inventory stats
  const overallStats = useMemo(() => {
    let totalServices = 0;
    let totalStock = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    allServices.forEach((service) => {
      totalServices++;
      totalStock += service.stock;
      totalValue += service.stock * service.price;

      if (service.stock === 0) outOfStockCount++;
      else if (service.stock < 10) lowStockCount++;
    });

    return {
      totalServices,
      totalStock,
      totalValue,
      lowStockCount,
      outOfStockCount,
    };
  }, [allServices]);

  // Memoized brand options for select
  const brandOptions = useMemo(
    () =>
      brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      })),
    [brands]
  );

  // Memoized series options for select
  const seriesOptions = useMemo(() => {
    if (!selectedBrand) return [];

    const brand = brands.find((b) => b.id === selectedBrand);
    if (!brand) return [];

    return brand.repairSeries.map((series) => ({
      value: series.id,
      label: series.name,
    }));
  }, [brands, selectedBrand]);

  // Memoized model options for select
  const modelOptions = useMemo(() => {
    if (!selectedSeries) return [];

    const series = brands
      .flatMap((b) => b.repairSeries)
      .find((s) => s.id === selectedSeries);

    if (!series) return [];

    return series.models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  }, [brands, selectedSeries]);

  // Memoized service type options for select
  const serviceTypeOptions = useMemo(() => {
    if (!selectedModel) return [];

    const model = brands
      .flatMap((b) => b.repairSeries)
      .flatMap((s) => s.models)
      .find((m) => m.id === selectedModel);

    if (!model) return [];

    return model.repairServiceType.map((serviceType) => ({
      value: serviceType.id,
      label: serviceType.name,
    }));
  }, [brands, selectedModel]);

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
                <div className="text-2xl font-bold">
                  {overallStats.totalServices}
                </div>
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
                <div className="text-2xl font-bold">
                  {overallStats.totalStock}
                </div>
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
                  ${overallStats.totalValue.toFixed(2)}
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
                  {overallStats.lowStockCount}
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
                  {overallStats.outOfStockCount}
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
                    onClick={() => handleViewChange("tree")}
                    disabled={isChangingView}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Hierarchy View
                  </Button>
                  <Button
                    variant={selectedView === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleViewChange("table")}
                    disabled={isChangingView}
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
              {/* <div className="flex items-center gap-4 mb-6">
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div> */}

              {/* Content with transition */}
              <div
                className={`transition-opacity duration-100 ${
                  isChangingView ? "opacity-0" : "opacity-100"
                }`}
              >
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
                        <Button variant="link" onClick={resetFilters}>
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      // Brand level - only render visible brands for performance
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
                              {/* Series level - only render when brand is expanded */}
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
                                      {/* Model level - only render when series is expanded */}
                                      {series.models.map((model) => (
                                        <div key={model.id}>
                                          <div
                                            className="flex items-center justify-between p-3 pl-12 cursor-pointer hover:bg-gray-50 border-b"
                                            onClick={() =>
                                              toggleModel(model.id)
                                            }
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
                                              {/* Service Type level - only render when model is expanded */}
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
                                                        {/* Service level - only render when service type is expanded */}
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
                  // Table view with pagination
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Select
                        value={selectedBrand || "defaultBrand"}
                        onValueChange={setSelectedBrand}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Brands" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defaultBrand">
                            All Brands
                          </SelectItem>
                          {brandOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedSeries || "defaultSeries"}
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
                          {seriesOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedModel || "defaultModel"}
                        onValueChange={setSelectedModel}
                        disabled={!selectedSeries}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Models" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defaultModel">
                            All Models
                          </SelectItem>
                          {modelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedServiceType || "defaultServiceType"}
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
                          {serviceTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                                </TableRow>
                              ))
                          ) : paginatedServices.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={9}
                                className="text-center py-4"
                              >
                                <div className="text-muted-foreground">
                                  No services found
                                </div>
                                <Button variant="link" onClick={resetFilters}>
                                  Clear filters
                                </Button>
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedServices.map((service) => (
                              <TableRow key={service.id}>
                                <TableCell className="font-medium">
                                  {service.name}
                                </TableCell>
                                <TableCell>{service.brand}</TableCell>
                                <TableCell>{service.series}</TableCell>
                                <TableCell>{service.model}</TableCell>
                                <TableCell>{service.serviceType}</TableCell>
                                <TableCell>{service.stock}</TableCell>
                                <TableCell>
                                  ${service.cost.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  ${service.price.toFixed(2)}
                                </TableCell>
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedView === "table" ? (
                  <>
                    Showing{" "}
                    {paginatedServices.length > 0
                      ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                      : 0}{" "}
                    to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredServices.length
                    )}{" "}
                    of {filteredServices.length} services
                  </>
                ) : (
                  <>
                    Showing {filteredBrands.length} brands with{" "}
                    {allServices.length} total services
                  </>
                )}
              </div>
              {selectedView === "table" && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
