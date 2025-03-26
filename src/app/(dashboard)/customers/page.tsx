import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone } from "lucide-react";
import Link from "next/link";

const mockContacts = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    company: "Tech Solutions",
    status: "Cliente",
    imageUrl: "https://avatar.vercel.sh/joao.png",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 98888-8888",
    company: "Digital Marketing",
    status: "Lead",
    imageUrl: "https://avatar.vercel.sh/maria.png",
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "(11) 97777-7777",
    company: "Inovação SA",
    status: "Cliente",
    imageUrl: "https://avatar.vercel.sh/pedro.png",
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 96666-6666",
    company: "Consultoria XYZ",
    status: "Prospect",
    imageUrl: "https://avatar.vercel.sh/ana.png",
  },
  {
    id: 5,
    name: "Lucas Mendes",
    email: "lucas.mendes@email.com",
    phone: "(11) 95555-5555",
    company: "Startup Inc",
    status: "Lead",
    imageUrl: "https://avatar.vercel.sh/lucas.png",
  },
];

const statusColors = {
  Cliente: "green",
  Lead: "blue",
  Prospect: "orange",
} as const;

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie seus contatos e leads
          </p>
        </div>
        <Button asChild>
          <Link href="/customers/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contato
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockContacts.map((contact) => (
          <Card 
            key={contact.id} 
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.imageUrl} alt={contact.name} />
                <AvatarFallback>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{contact.name}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`bg-${statusColors[contact.status as keyof typeof statusColors]}-500/10 text-${statusColors[contact.status as keyof typeof statusColors]}-500 border-0`}
                  >
                    {contact.status}
                  </Badge>
                </div>
                <CardDescription>{contact.company}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{contact.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
