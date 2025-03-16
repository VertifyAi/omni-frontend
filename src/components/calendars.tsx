import * as React from "react"
import { Check, ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Calendars({
  calendars,
}: {
  calendars: {
    name: string
    items: string[]
  }[]
}) {
  return (
    <>
      {calendars.map((calendar, index) => (
        <React.Fragment key={calendar.name}>
          <div className="py-2">
            <Collapsible defaultOpen={index === 0} className="group/collapsible">
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sm hover:text-blue-600 transition-colors">
                {calendar.name}
                <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-1">
                  {calendar.items.map((item, index) => (
                    <Button
                      key={item}
                      variant="ghost"
                      className="w-full justify-start gap-2 px-2"
                    >
                      <div
                        data-active={index < 2}
                        className="group/calendar-item flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-200 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600"
                      >
                        <Check className="hidden h-3 w-3 text-white group-data-[active=true]/calendar-item:block" />
                      </div>
                      {item}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <Separator />
        </React.Fragment>
      ))}
    </>
  )
}
