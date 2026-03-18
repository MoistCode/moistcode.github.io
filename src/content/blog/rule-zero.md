---
title: "Rule Zero"
description: "My AI agents skipped its own memory protocol. The fix wasn't adding more warnings, it was making sure it was top of mind."
date: 2026-03-17
tags: ["architecture", "tooling"]
draft: false
---

## The Problem

AI coding agents are stateless. Every session starts from nothing. The agent reads its instructions, reads the contextual information, does its work, and then forgets everything. Next session, blank slate.

I built a memory system in an attempt to fix this. An Obsidian vault connected via MCP that stores preferences, decisions, code patterns, and blockers across sessions. The agent retrieves relevant memories at the start of each session and logs new ones when something worth remembering surfaces. I wrote a full protocol for it: retrieve before work, log every operation, evaluate what to store, audit at session end.

The protocol lived in my AGENTS.md, the instruction file every agent reads at session start. It was marked `MANDATORY` and the section header said `You MUST load it at the start of every session.`

## What Happened

I ran a session to plan and write a blog post about a command center for my OpenCode agents. The session spanned 118 messages across multiple agent types: a planner, an executor, and several subagents handling Mermaid rendering, writing, and visual QA. Real work, real bugs found and fixed, real output shipped.

The memory protocol was skipped entirely.

Out of everything that happened in that session, exactly one preference was saved, and only because I explicitly told the agent to save it. Five architectural decisions, three blockers discovered and resolved, an entire project context for the blog... all gone. The agent read the AGENTS.md, saw the `MANDATORY` label, and moved straight to the task because the task is the priority.

## The Conversation

After the session I asked: "How can you guarantee it won't happen again?"

The answer was honest: "I can't. Telling you 'I'll remember next time' is meaningless since each session starts with a blank slate."

That's the core tension. The agent that promises to do better next time is not the agent that runs next time. There is no continuity of intention. There's only a configuration file and whatever weight the model gives to each line in it.

## The Fix(?)

The memory protocol was at line 166 of AGENTS.md. That's after 150 lines of Obsidian vault conventions, folder structures, and tag taxonomies. By the time the model processes it, the instruction is competing with the system prompt, loaded skills, and the user's actual request for attention and that's not even considering it possibly being lost during compaction.

I moved it to line 1. Named it Rule Zero. Made it the first thing any model reads when the file is injected into context.

Four concrete steps: load the memory skill, search the vault for the current project, read the latest handoff note, log the retrieval. And a self-correction clause: "If you catch yourself already working without having done this: STOP. Do it now. Then continue." The self-correction handles the case where the model skips it on first pass but encounters a reminder later in the file.

## The Honest Part

This is not a fix in the way a bug fix is a fix. There's no test I can write that guarantees an LLM will follow an instruction. The model interprets text probabilistically. Position in the file shifts the probability. Emphasis helps. Repetition helps. A concrete checklist is harder to skip than an abstract `MANDATORY` label. None of it is deterministic.

What I know: line 1 gets more attention than line 166. A self-correction clause catches some failures that a bare instruction misses. Naming something "Rule Zero" gives it more weight than burying it in a subsection.

What I don't know: whether a sufficiently complex first message can still sweep the agent past the preamble. Probably.

I'm building on a foundation that follows instructions almost always. Almost.
