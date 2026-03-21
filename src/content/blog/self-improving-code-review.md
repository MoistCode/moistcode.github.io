---
title: "Teaching the Bot to Take Notes"
description: "My AI code reviewer kept making the same mistakes, so I built a system where human corrections feed back into its rules automatically."
date: 2026-03-20
tags: ["architecture", "tooling"]
draft: false
---

## The Problem

I have an AI bot that reviews pull requests. It reads a set of rules, looks at the diff, and leaves comments focusing on the most severe feedback. Sometimes the comments are useful. Sometimes they flag something that's completely fine, or miss a pattern the team actually cares about.

When a human pushes back on a bad suggestion, the bot learns nothing. At some point, the same bad call on the same kind of code comes back up. The code review starts to become more annoying than helpful. This is the same statelessness problem I wrote about in Rule Zero, just applied to code review instead of agent memory. Every review starts from the same static rules file, and no amount of human feedback changes what's in it.

The signal is not in the bot's comments. It's in the comments where a human disagreed. That's the feedback worth capturing.

## The Loop

The system has three pieces, and they run in sequence.

First, capture. A team member runs a `/improve-code-review` slash command on a PR where the bot got something wrong. The command grabs the bot's original comment and the human's correction, then drops both into a backlog issue which are queued to be engrained into the bot's behavior.

Second, process. A scheduled GitHub Actions workflow runs on weekday mornings at 10am ET. It reads unprocessed items from the backlog, feeds them into a prompt that synthesizes rule updates, and opens a draft PR against the review rules file. The prompt sees the pattern across multiple corrections and proposes changes that address the underlying gap, not just the individual complaint.

Third, merge. A human reviews the draft PR before it touches anything. The rules don't change until someone approves the change.

The recursion is straightforward: AI reviews code, humans correct the AI, corrections change how the AI reviews next time. This ensures the reviews are capturing the team's patterns and is constantly surfacing useful feedback over time.

I kept the tooling simple. The processing logic is bash (because who hates bash) and `jq`` (string manipulation and JSON wrangling, not application logic). The model name lives in a GitHub Actions variable so swapping models is a one-line change, not a code change especially with how often models change these days.

## The Human in the Middle

There's a line from The Mythical Man-Month that I think about here: adding people to a late project makes it later. The Factory Model inverts that for automation. Human review is the safety system, not a bottleneck.

Every piece of this loop has a human gate, and that's a design choice. The slash command is manual on purpose. A human decides which corrections matter enough to feed back. The backlog is human-curated on purpose. Not every disagreement is a rule change. The draft PR is a draft on purpose. The AI proposes, a human disposes.

I could automate any of these gates away. Auto-capture every disagreement. Auto-merge rule updates that pass CI. But each gate removed is a place where bad feedback or a bad synthesis can propagate unchecked. The whole point of the system is that humans are better at judging review quality than the bot is. Removing the humans from the loop defeats the purpose of the loop.

The loop works. The edges are rough but humans are here to help refine it for future generations.
