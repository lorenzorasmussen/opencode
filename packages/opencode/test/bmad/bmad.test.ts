import { describe, it, expect } from "vitest"
import { BMAD, BMADCycle } from "../../src/bmad"

describe("BMAD Implementation", () => {
  it("should create a BMAD instance", () => {
    const bmad = new BMAD()
    expect(bmad).toBeDefined()
    expect(bmad.getCycleHistory()).toEqual([])
  })

  it("should execute a complete BMAD cycle", async () => {
    const bmad = new BMAD()
    const result = await bmad.executeCycle("Test Task")

    expect(result).toBeDefined()
    expect(result.task).toBe("Test Task")
    expect(result.success).toBe(true)
    expect(result.phases).toHaveLength(4)
    expect(result.phases.map((p) => p.phase)).toEqual(["build", "measure", "analyze", "deploy"])
  })

  it("should track cycle history", async () => {
    const bmad = new BMAD()

    await bmad.executeCycle("Task 1")
    await bmad.executeCycle("Task 2")

    const history = bmad.getCycleHistory()
    expect(history).toHaveLength(2)
    expect(history[0].task).toBe("Task 1")
    expect(history[1].task).toBe("Task 2")
  })

  it("should return latest result", async () => {
    const bmad = new BMAD()

    expect(bmad.getLatestResult()).toBeNull()

    await bmad.executeCycle("Test Task")
    const latest = bmad.getLatestResult()

    expect(latest).toBeDefined()
    expect(latest?.task).toBe("Test Task")
  })
})

describe("BMADCycle", () => {
  it("should create a cycle with correct initial state", () => {
    const cycle = new BMADCycle("Test Task")

    expect(cycle.getResult().task).toBe("Test Task")
    expect(cycle.getResult().phases).toHaveLength(0)
    expect(cycle.getResult().success).toBe(false) // not completed yet
  })

  it("should execute all phases successfully", async () => {
    const cycle = new BMADCycle("Test Task")

    await cycle.build()
    await cycle.measure()
    await cycle.analyze()
    await cycle.deploy()

    const result = cycle.getResult()
    expect(result.success).toBe(true)
    expect(result.phases).toHaveLength(4)
    expect(result.totalDuration).toBeGreaterThan(0)
  })

  it("should collect metrics for each phase", async () => {
    const cycle = new BMADCycle("Test Task")

    await cycle.build()
    const result = cycle.getResult()

    expect(result.phases[0].metrics).toBeDefined()
    expect(result.phases[0].metrics.linesOfCode).toBeDefined()
    expect(result.phases[0].duration).toBeGreaterThan(0)
  })
})
