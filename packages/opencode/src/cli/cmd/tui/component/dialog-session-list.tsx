import { useDialog } from "@tui/ui/dialog"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useRoute } from "@tui/context/route"
import { useSync } from "@tui/context/sync"
import { createMemo, createSignal, onMount } from "solid-js"
import { Locale } from "@/util/locale"
import { Keybind } from "@/util/keybind"
import { useTheme } from "../context/theme"
import { useSDK } from "../context/sdk"
import { DialogSessionRename } from "./dialog-session-rename"

export function DialogSessionList() {
  const dialog = useDialog()
  const sync = useSync()
  const { theme } = useTheme()
  const route = useRoute()
  const sdk = useSDK()

  const [toDelete, setToDelete] = createSignal<string>()
  const [parentID, setParentID] = createSignal<string | undefined>()

  const options = createMemo(() => {
    const today = new Date().toDateString()
    const currentParentID = parentID()

    return sync.data.session
      .filter((x) => x.parentID === currentParentID)
      .map((x) => {
        const date = new Date(x.time.updated)
        let category = date.toDateString()
        if (category === today) {
          category = "Today"
        }
        const isDeleting = toDelete() === x.id
        const hasChildren = sync.data.session.some(s => s.parentID === x.id)
        return {
          title: isDeleting ? "Press delete again to confirm" : x.title,
          bg: isDeleting ? theme.error : undefined,
          value: x.id,
          category,
          footer: Locale.time(x.time.updated) + (hasChildren ? " →" : ""),
        }
      })
  })

  onMount(() => {
    dialog.setSize("large")
  })

  const title = createMemo(() => {
    if (parentID()) {
      return `Child Sessions${breadcrumb()}`
    }
    return "Sessions"
  })

  const breadcrumb = createMemo(() => {
    const crumbs = []
    let currentID = parentID()
    while (currentID) {
      const session = sync.data.session.find(s => s.id === currentID)
      if (session) {
        crumbs.unshift(session.title)
        currentID = session.parentID
      } else {
        break
      }
    }
    return crumbs.length > 0 ? ` → ${crumbs.join(' → ')}` : ''
  })

  return (
    <DialogSelect
      title={title()}
      options={options()}
      limit={50}
      onMove={() => {
        setToDelete(undefined)
      }}
      onSelect={(option) => {
        route.navigate({
          type: "session",
          sessionID: option.value,
        })
        dialog.clear()
      }}
       keybind={[
         {
           keybind: Keybind.parse("delete")[0],
           title: "delete",
           onTrigger: async (option) => {
             if (toDelete() === option.value) {
               sdk.client.session.delete({
                 path: {
                   id: option.value,
                 },
               })
               setToDelete(undefined)
               return
             }
             setToDelete(option.value)
           },
         },
         {
           keybind: Keybind.parse("r")[0],
           title: "rename",
           onTrigger: async (option) => {
             dialog.replace(() => <DialogSessionRename session={option.value} />)
           },
         },
         {
           keybind: Keybind.parse("ctrl+right")[0],
           title: "enter children",
           onTrigger: async (option) => {
             const hasChildren = sync.data.session.some(s => s.parentID === option.value)
             if (hasChildren) {
               setParentID(option.value)
               setToDelete(undefined)
             }
           },
         },
         {
           keybind: Keybind.parse("ctrl+left")[0],
           title: "back to parent",
           onTrigger: async () => {
             if (parentID()) {
               setParentID(undefined)
               setToDelete(undefined)
             }
           },
         },
       ]}
    />
  )
}
