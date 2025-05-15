"use client";

import React, { useEffect, useState } from "react";
import { Menu, Sunset, Trees, Zap } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup?: {
      text: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "",
    src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/1svg.svg",
    alt: "logo",
    title: "Vertify",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Produtos",
      url: "#",
      items: [
        {
          title: "Omni",
          description: "Sistema completo de atendimento ao cliente com IA",
          icon: <Zap className="size-5 shrink-0" />,
          url: "https://vertify.com.br/sign-in",
        },
      ],
    },
    {
      title: "Casos de Uso",
      url: "#",
      items: [
        {
          title: "Vendas",
          description: "Gestão completa do seu funil de vendas",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#tab",
        },
        {
          title: "Suporte",
          description: "Atendimento e suporte ao cliente integrado",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#tab",
        },
        {
          title: "Comunicação Interna",
          description: "Ferramentas para melhorar a comunicação da sua equipe",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#tab",
        },
      ],
    },
    // {
    //   title: "Preço",
    //   url: "#",
    // },
    // {
    //   title: "Blog",
    //   url: "#",
    // },
  ],
  auth = {
    login: { text: "Entrar", url: "/sign-in" },
    // signup: { text: "Acesso Exclusivo", url: "/sign-up" },
  },
}: Navbar1Props) => {
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location.href);
    }
  }, []);

  return (
    <section className="py-4 flex justify-center items-center fixed w-screen z-50 bg-background/90 backdrop-blur-sm">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url || location} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={72}
                height={32}
                className="w-18"
              />
              {/* <span className="text-lg font-semibold">{logo.title}</span> */}
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button asChild variant="outline" size="sm">
              <a href={auth.login.url}>{auth.login.text}</a>
            </Button>
            {auth.signup && (
              <Button asChild size="sm">
                <a href={auth.signup.url}>{auth.signup.text}</a>
              </Button>
            )}
          </div>
        </nav>
        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url || location} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={72}
                height={32}
                className="w-18"
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a
                      href={logo.url || location}
                      className="flex items-center gap-2"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={72}
                        height={32}
                        className="w-8"
                      />
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.text}</a>
                    </Button>
                    {auth.signup && (
                      <Button asChild>
                        <a href={auth.signup.url}>{auth.signup.text}</a>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid w-[400px] gap-1 p-4">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <SubMenuLink item={subItem} />
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-4 leading-none no-underline transition-colors outline-none select-none hover:bg-accent/50 hover:text-accent-foreground"
      href={item.url}
    >
      <div className="rounded-md bg-accent/10 p-2">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold leading-none">{item.title}</div>
        {item.description && (
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };
