"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { UserRole } from "@/types/users";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Tipo para usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Construir query params
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      if (debouncedSearchTerm) {
        queryParams.append("search", debouncedSearchTerm);
      }

      if (selectedRole && selectedRole !== "all") {
        queryParams.append("role", selectedRole);
      }

      const response = await fetchApi(`/api/users?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar usuários");
      }

      setUsers(data.users);
      setTotalPages(data.totalPages || Math.ceil(data.total / pageSize) || 1);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearchTerm, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleEditUser = (userId: string) => {
    // Implementar lógica de edição de usuário
    console.log("Editar usuário:", userId);
  };

  const handleDeleteUser = (userId: string) => {
    // Implementar lógica de exclusão de usuário
    console.log("Excluir usuário:", userId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxDisplayed = 5; // Maximum number of page links to display

    if (totalPages <= maxDisplayed) {
      // If total pages are less than max displayed, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of the middle section
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      // Adjust if we're at the beginning or end
      if (page <= 2) {
        end = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis (using different value to have unique keys)
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="container p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os usuários e suas permissões.
          </p>
        </div>
        <CreateUserForm onUserCreated={handleUserCreated} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar usuário"
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
              <SelectItem value={UserRole.USER}>Usuário</SelectItem>
              <SelectItem value={UserRole.MANAGER}>Gestor</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum usuário encontrado.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="group flex items-center justify-between p-4 hover:bg-muted transition-colors rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground mr-4">
                      {user.role === UserRole.ADMIN
                        ? "Administrador"
                        : user.role === UserRole.USER
                        ? "Usuário"
                        : "Gestor"}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user.id)}
                        className="hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Itens por página:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1); // Reset to first page when changing page size
                }}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && handlePageChange(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum, i) => (
                  <PaginationItem key={`page-${pageNum}-${i}`}>
                    {pageNum === -1 || pageNum === -2 ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={page === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < totalPages && handlePageChange(page + 1)
                    }
                    className={
                      page >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Custom Ellipsis component since we didn't import it from the original file
function PaginationEllipsis() {
  return (
    <span className="flex h-9 w-9 items-center justify-center">
      <span className="h-4 w-4">...</span>
      <span className="sr-only">More pages</span>
    </span>
  );
}
