import { json, query, action, useParams, useAction, createAsync, useSubmission } from "@solidjs/router"
import { createMemo, Show } from "solid-js"
import { Billing } from "@opencode/console-core/billing.js"
import { withActor } from "~/context/auth.withActor"
import { IconCreditCard } from "~/component/icon"
import styles from "./billing-section.module.css"
import { Database, eq } from "@opencode/console-core/drizzle/index.js"
import { BillingTable } from "@opencode/console-core/schema/billing.sql.js"

const createCheckoutUrl = action(async (workspaceID: string, successUrl: string, cancelUrl: string) => {
  "use server"
  return withActor(() => Billing.generateCheckoutUrl({ successUrl, cancelUrl }), workspaceID)
}, "checkoutUrl")

const reload = action(async (form: FormData) => {
  "use server"
  const workspaceID = form.get("workspaceID")?.toString()
  if (!workspaceID) return { error: "Workspace ID is required" }
  return json(await withActor(() => Billing.reload(), workspaceID), { revalidate: getBillingInfo.key })
}, "billing.reload")

const setReload = action(async (form: FormData) => {
  "use server"
  const workspaceID = form.get("workspaceID")?.toString()
  if (!workspaceID) return { error: "Workspace ID is required" }
  const reload = form.get("reload")?.toString() === "true"
  return json(
    await Database.use((tx) =>
      tx
        .update(BillingTable)
        .set({
          reload,
        })
        .where(eq(BillingTable.workspaceID, workspaceID)),
    ),
    { revalidate: getBillingInfo.key },
  )
}, "billing.setReload")

const createSessionUrl = action(async (workspaceID: string, returnUrl: string) => {
  "use server"
  return withActor(() => Billing.generateSessionUrl({ returnUrl }), workspaceID)
}, "sessionUrl")

const getBillingInfo = query(async (workspaceID: string) => {
  "use server"
  return withActor(async () => {
    return await Billing.get()
  }, workspaceID)
}, "billing.get")

export function BillingSection() {
  const params = useParams()
  // ORIGINAL CODE - COMMENTED OUT FOR TESTING
  const balanceInfo = createAsync(() => getBillingInfo(params.id))
  const createCheckoutUrlAction = useAction(createCheckoutUrl)
  const createCheckoutUrlSubmission = useSubmission(createCheckoutUrl)
  const createSessionUrlAction = useAction(createSessionUrl)
  const createSessionUrlSubmission = useSubmission(createSessionUrl)
  const setReloadSubmission = useSubmission(setReload)
  const reloadSubmission = useSubmission(reload)

  // DUMMY DATA FOR TESTING - UNCOMMENT ONE OF THE SCENARIOS BELOW

  // Scenario 1: User has not added billing details and has no balance
  // const balanceInfo = () => ({
  //   balance: 0,
  //   paymentMethodLast4: null as string | null,
  //   reload: false,
  //   reloadError: null as string | null,
  //   timeReloadError: null as Date | null,
  // })

  // Scenario 2: User has not added billing details but has a balance
  // const balanceInfo = () => ({
  //   balance: 1500000000, // $15.00
  //   paymentMethodLast4: null as string | null,
  //   reload: false,
  //   reloadError: null as string | null,
  //   timeReloadError: null as Date | null
  // })

  // Scenario 3: User has added billing details (reload enabled)
  // const balanceInfo = () => ({
  //   balance: 750000000, // $7.50
  //   paymentMethodLast4: "4242",
  //   reload: true,
  //   reloadError: null as string | null,
  //   timeReloadError: null as Date | null
  // })

  // Scenario 4: User has billing details but reload failed
  // const balanceInfo = () => ({
  //   balance: 250000000, // $2.50
  //   paymentMethodLast4: "4242",
  //   reload: true,
  //   reloadError: "Your card was declined." as string,
  //   timeReloadError: new Date(Date.now() - 3600000) as Date // 1 hour ago
  // })

  const balanceAmount = createMemo(() => {
    return ((balanceInfo()?.balance ?? 0) / 100000000).toFixed(2)
  })

  const hasBalance = createMemo(() => {
    return (balanceInfo()?.balance ?? 0) > 0 && balanceAmount() !== "0.00"
  })

  return (
    <section class={styles.root}>
      <div data-slot="section-title">
        <h2>Billing</h2>
        <p>
          Manage payments methods. <a href="mailto:contact@anoma.ly">Contact us</a> if you have any questions.
        </p>
      </div>
      <div data-slot="section-content">
        <Show when={balanceInfo()?.reloadError}>
          <div data-slot="reload-error">
            <p>
              Reload failed at{" "}
              {balanceInfo()?.timeReloadError!.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              })}
              . Reason: {balanceInfo()?.reloadError?.replace(/\.$/, "")}. Please update your payment method and try
              again.
            </p>
            <form action={reload} method="post" data-slot="create-form">
              <input type="hidden" name="workspaceID" value={params.id} />
              <button data-color="primary" type="submit" disabled={reloadSubmission.pending}>
                {reloadSubmission.pending ? "Reloading..." : "Reload"}
              </button>
            </form>
          </div>
        </Show>
        <div data-slot="payment">
          <div data-slot="credit-card">
            <div data-slot="card-icon">
              <IconCreditCard style={{ width: "32px", height: "32px" }} />
            </div>
            <div data-slot="card-details">
              <Show when={balanceInfo()?.paymentMethodLast4} fallback={<span data-slot="number">----</span>}>
                <span data-slot="secret">••••</span>
                <span data-slot="number">{balanceInfo()?.paymentMethodLast4}</span>
              </Show>
            </div>
          </div>
          <div data-slot="button-row">
            <Show
              when={balanceInfo()?.reload}
              fallback={
                <Show
                  when={hasBalance()}
                  fallback={
                    <button
                      data-color="primary"
                      disabled={createCheckoutUrlSubmission.pending}
                      onClick={async () => {
                        const baseUrl = window.location.href
                        const checkoutUrl = await createCheckoutUrlAction(params.id, baseUrl, baseUrl)
                        if (checkoutUrl) {
                          window.location.href = checkoutUrl
                        }
                      }}
                    >
                      {createCheckoutUrlSubmission.pending ? "Loading..." : "Enable Billing"}
                    </button>
                  }
                >
                  <form action={setReload} method="post" data-slot="create-form">
                    <input type="hidden" name="workspaceID" value={params.id} />
                    <input type="hidden" name="reload" value="true" />
                    <button data-color="primary" type="submit" disabled={setReloadSubmission.pending}>
                      {setReloadSubmission.pending ? "Enabling..." : "Enable Billing"}
                    </button>
                  </form>
                </Show>
              }
            >
              <button
                data-color="primary"
                disabled={createSessionUrlSubmission.pending}
                onClick={async () => {
                  const baseUrl = window.location.href
                  const sessionUrl = await createSessionUrlAction(params.id, baseUrl)
                  if (sessionUrl) {
                    window.location.href = sessionUrl
                  }
                }}
              >
                {createSessionUrlSubmission.pending ? "Loading..." : "Manage Payment Methods"}
              </button>
              <form action={setReload} method="post" data-slot="create-form">
                <input type="hidden" name="workspaceID" value={params.id} />
                <input type="hidden" name="reload" value="false" />
                <button data-color="ghost" type="submit" disabled={setReloadSubmission.pending}>
                  {setReloadSubmission.pending ? "Disabling..." : "Disable"}
                </button>
              </form>
            </Show>
          </div>
        </div>
        <div data-slot="usage">
          <Show when={!balanceInfo()?.reload}>
            <Show
              when={hasBalance()}
              fallback={
                <p>
                  We'll load <b>$20</b> (+$1.23 processing fee) and reload it when it reaches <b>$5</b>.
                </p>
              }
            >
              <p>
                You have <b data-slot="value">${balanceAmount() === "-0.00" ? "0.00" : balanceAmount()}</b> remaining in
                your account. You can continue using the API with your remaining balance.
              </p>
            </Show>
          </Show>
          <Show when={balanceInfo()?.reload && !balanceInfo()?.reloadError}>
            <p>
              Your current balance is <b data-slot="value">${balanceAmount() === "-0.00" ? "0.00" : balanceAmount()}</b>
              . We'll automatically reload <b>$20</b> (+$1.23 processing fee) when it reaches <b>$5</b>.
            </p>
          </Show>
        </div>
      </div>
    </section>
  )
}
