---
title: "SWE Data Engine: Scalable Training Data for Code Agents"
date: 2025-11-10
draft: True
description: "An automated pipeline for generating high-quality training data from real-world software repositories."
summary: "The SWE Data Engine is our automated pipeline for generating high-quality training data from real-world software repositories. It transforms raw repository history into structured training examples — including bug fixes, feature implementations, and code reviews — at scale."
tags: ["Data", "Training", "Open-Source", "Infrastructure"]
categories: ["Open-Source"]
authors: ["Awe-AI Team"]
---

## Overview

The SWE Data Engine is our automated pipeline for generating high-quality training data from real-world software repositories. It transforms raw repository history into structured training examples at scale.

## Pipeline Stages

### 1. Repository Mining
Automated collection and filtering of repositories based on quality metrics, activity levels, and language distribution.

### 2. Issue-PR Linking
Intelligent matching of issues to their corresponding pull requests, creating natural (problem, solution) pairs.

### 3. Environment Reproduction
Automated Docker environment generation that faithfully reproduces the build and test setup at each commit point.

### 4. Quality Filtering
Multi-stage filtering pipeline that ensures data quality through:
- Test validation (solutions must pass existing tests)
- Diff complexity analysis
- Code quality scoring
- Deduplication

### 5. Data Formatting
Conversion into various training formats:
- SFT (Supervised Fine-Tuning) trajectories
- RLHF preference pairs
- Agent interaction traces

## Scale

| Metric | Count |
|--------|-------|
| Repositories Processed | 50,000+ |
| Training Examples | 500,000+ |
| Languages Covered | 15+ |
| Docker Environments | 10,000+ |

## Links

- [Dataset on HuggingFace](https://huggingface.co/datasets/awe-ai/swe-data)
- [Pipeline Documentation](https://awe-ai.example.com/docs/data-engine)
