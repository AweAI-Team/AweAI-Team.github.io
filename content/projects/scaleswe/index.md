---
title: "Immersion in the GitHub Universe: Scaling Coding Agents to Mastery"
date: 2026-02-10
draft: false
description: "we propose ScaleSWE, an automated, sandboxed multi agent workflow designed to construct high quality SWE data at scale."
tags: ["Software Engineering", "Code Agent"]
categories: ["Artificial Intelligence"]
authors: ["Jiale Zhao*, Guoxin Chen*, Fanzhe Meng*, Minghao Li, Jie Chen, Hui Xu, Yongshuai Sun, Xin Zhao, Ruihua Song, Yuan Zhang, Peng Wang, Cheng Chen, Jirong Wen, Kai Jia"]
---

## Overview

Achieving mastery in real world software engineering tasks is fundamentally bottlenecked by the scarcity of large scale, high quality training data. Scaling such data has been limited by the complexity of environment setup, unit test generation, and problem statement curation. In this paper, we propose ScaleSWE, an automated, sandboxed multi agent workflow designed to construct high quality SWE data at scale. The system coordinates three specialized agents for environment setup, test creation, and problem description synthesis to process 6 million pull requests across 5200 repositories, producing Scale SWE Data: 100k verified SWE instances, the largest such dataset to date. It substantially surpasses existing real world datasets in repository diversity and reflects realistic task complexity. We further demonstrate the dataset utility for training by distilling 71498 high quality trajectories and finetuning Qwen30BA3BInstruct to produce ScaleSWE Agent. Our agent achieves a 64 resolve rate on SWE Bench Verified a nearly three fold improvement over the base model. ScaleSWE provides a scalable, reproducible approach for data construction to advance LLM based software engineering. Scale SWE will be publicly available.

## Performance
![](images/performance.png)

## Links

- [Arxiv](https://arxiv.org/abs/2602.09892){{< icon "arxiv" >}}
- [Dataset on HuggingFace](https://huggingface.co/datasets/Awe-AI/Scale-SWE){{< icon "huggingface" >}}
- [Model on HuggingFace](https://huggingface.co/Awe-AI/Scale-SWE){{< icon "huggingface" >}}
