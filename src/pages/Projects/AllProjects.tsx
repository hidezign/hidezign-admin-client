import { getAllProjects } from "@/API/admin.api";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";
import PageLoader from "@/components/PageLoader";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
// import BasicTableOne from "@/components/tables/BasicTables/BasicTableOne";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
// import React from "react";

interface Order {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  file: {
    url: string;
    publicId: string;
  };
  isShowHome: boolean;
  technologies: string[];
  liveUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AllProjects = () => {

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Order[]>([]);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects();
      if (response?.success) {
        setProjects(response?.projects);
      } else {
        toast.error(response?.message || "Failed to fetch projects", {
          duration: 5000,
          className: "bg-card text-card-foreground border-border",
        });
      }
    } catch (error) {
      toast.error("Something went wrong while fetching projects", {
        description: error.message || "",
        duration: 5000,
        className: "bg-card text-card-foreground border-border",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProjects();
  }, []);

  // const tableData: Order[]

  return (
    <>
      {loading && <PageLoader />}
      <PageMeta
        title="React.js Basic Tables Dashboard | "
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard title="Projects" desc="">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Image
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Project Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Show on homepage
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Live URL
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {projects.map((order) => (
                    <TableRow key={order?._id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-md">
                            <img
                              width={40}
                              height={40}
                              src={
                                order?.image?.url
                              }
                              alt={
                                order?.image?.publicId
                              }
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.description}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.isActive ? (
                          <Badge color="success">Active</Badge>
                        ) : (
                          <Badge color="dark">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.isShowHome ? (
                          <Badge color="success">Active</Badge>
                        ) : (
                          <Badge color="dark">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.liveUrl ? (
                          <Button
                            // href={order.liveUrl}
                            variant="outline"
                            size="sm"
                          >
                            <Link to={order.liveUrl} target="_blank" rel="noopener noreferrer">
                              Visit
                            </Link>
                          </Button>
                        ) : ("-")}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Link to={`/project-details/${order._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default AllProjects;
