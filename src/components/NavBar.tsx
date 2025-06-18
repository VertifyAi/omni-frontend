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
    { title: "Início", url: "#" },
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
    signup: { text: "Teste grátis por 30 dias", url: "/sign-up" },
  },
}: Navbar1Props) => {
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location.href);
    }
  }, []);

  return (
    <section className="fixed top-0 left-0 right-0 flex justify-center items-center w-full z-50 pt-4 px-4 mb-20">
      <div className="py-3 px-8 bg-white-soft/95 backdrop-blur-lg border border-white-warm/60 rounded-2xl shadow-xl shadow-black/10 w-[90%]">
        <div className="container mx-auto max-w-7xl w-full">
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
            <Button asChild variant="outline" size="sm" className="hover-cool-blue bg-white-pure border-white-warm">
              <a href={auth.login.url}>{auth.login.text}</a>
            </Button>
            {auth.signup && (
              <Button asChild size="sm" className="gradient-brand hover:opacity-90 elevated-1">
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
                <Button variant="outline" size="icon" className="hover-cool-blue">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-white-pure/95 backdrop-blur-md">
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
                    <Button asChild variant="outline" className="hover-cool-blue">
                      <a href={auth.login.url}>{auth.login.text}</a>
                    </Button>
                    {auth.signup && (
                      <Button asChild className="gradient-cool hover:opacity-90">
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
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 hover-warm-slate">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid w-[400px] gap-1 p-4 bg-white-pure border border-white-warm shadow-white-elevated">
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
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white-warm hover:text-accent-foreground hover-warm-slate"
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
      className="flex flex-row gap-4 rounded-md p-4 leading-none no-underline transition-colors outline-none select-none hover:bg-accent/50 hover:text-accent-foreground hover-cool-teal"
      href={item.url}
    >
      <div className="rounded-md bg-accent/10 p-2 bg-cool-teal-subtle">{item.icon}</div>
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

// Para usar este navbar, adicione a seguinte classe no container principal da sua página:
// <main className="pt-24"> ou adicione margin-top: 6rem; no seu CSS
// Isso garantirá que o conteúdo não fique atrás do navbar fixo
