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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { IoTrashBin } from "react-icons/io5";
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
        description: (error as Error).message || "",
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

                      {/* Image */}
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                            <img
                              width={40}
                              height={40}
                              src={
                                order?.image?.url
                              }
                              alt={
                                order?.image?.publicId
                              }
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.title}
                      </TableCell>

                      {/* Description */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.description}
                      </TableCell>

                      {/* Active Status */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.isActive ? (
                          <Badge color="success">Active</Badge>
                        ) : (
                          <Badge color="dark">Inactive</Badge>
                        )}
                      </TableCell>

                      {/* Show on Home */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.isShowHome ? (
                          <Badge color="success">
                            <FaEye />
                          </Badge>
                        ) : (
                            <Badge color="dark">
                              <FaEyeSlash />
                            </Badge>
                        )}
                      </TableCell>

                      {/* Live URL */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {order?.liveUrl ? (
                          <Link to={order.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button
                              // href={order.liveUrl}
                              variant="outline"
                              size="sm"
                            >
                              <GoLinkExternal />
                            </Button>
                          </Link>
                        ) : ("-")}
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex gap-2">

                        {/* VIEW */}
                        <Link to={`/project-details/${order._id}`}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-full border hover:border-blue-500 hover:text-blue-500 hover:bg-white transition-all duration-300"
                          >
                            <FaEye />
                          </Button>
                        </Link>

                        {/* DELETE */}
                        <Link to={`/project-details/${order._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-red-600 border-red-600 hover:text-white hover:bg-red-600"
                          >
                            <IoTrashBin />
                          </Button>
                        </Link>
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
