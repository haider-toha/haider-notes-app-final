# N18 — parallel navier-stokes solver

folder: projects
date: 15 august 2025
slug: parallel-navier-stokes

===== PHYSICAL PAGE 180 =====

[ ] copied

[N18]

parallel navier-stokes solver

a high-performance c++ solver for 2d incompressible fluid
dynamics. built during my aeronautics degree when i
wanted to understand both the physics and the
computational techniques at a low level.

the problem
simulating fluid flow is computationally expensive. the navier-stokes
equations describe how velocity fields evolve:

\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{f}

\nabla \cdot \mathbf{u} = 0

where $\mathbf{u}$ is velocity, $p$ is pressure, $\rho$
is density, $\nu$ is kinematic viscosity and $\mathbf{f}$
represents external forces. solving them at high resolution
requires millions of calculations per timestep. sequential code
hits a wall fast.

approach
i implemented a pressure-projection method:
1. advect velocity field (move fluid)
2. apply external forces (gravity, etc.)
3. solve pressure poisson equation (enforce incompressibility)

===== END PHYSICAL PAGE 180 =====
===== PHYSICAL PAGE 181 =====

[ ] copied

[N18 continued]

4. project velocity to be divergence-free

the expensive part is step 3, solving the
pressure poisson equation:

\nabla^2 p = \frac{\rho}{\Delta t} \nabla \cdot \mathbf{u}^*

i used a jacobi iterative solver where each
cell update only depends on its neighbours:

p_{i,j}^{n+1} = \frac{1}{4}(p_{i+1,j}^n + p_{i-1,j}^n + p_{i,j+1}^n + p_{i,j-1}^n - \Delta x^2 b_{i,j})

this is embarrassingly parallel since each cell can
be updated independently.

parallelisation strategy
- mpi for distributed memory: split the grid across
  nodes. each node owns a horizontal slice. ghost
  cell exchanges happen at boundaries
- openmp for shared memory: within each node, parallelise
  the inner loops with pragma directives. cache-aware iteration
  order (row-major) reduced l1/l2 misses by ~40%

===== END PHYSICAL PAGE 181 =====
===== PHYSICAL PAGE 182 =====

[ ] copied

[N18 continued]

- hybrid approach: mpi between nodes, openmp within nodes.
  this matched the cluster architecture (16 cores per
  node, 8 nodes)

optimisations
- aligned memory allocation for simd vectorisation
- loop tiling to improve cache locality
- asynchronous mpi communication overlapped with computation
- red-black gauss-seidel for faster convergence (2x fewer iterations
  than jacobi)

results
- achieved near-linear speedup up to 64 cores, with
  parallel efficiency $E = S/P \approx 0.88$ where
  $S$ is speedup and $P$ is processor count
- 512x512 grid at 1000 timesteps: 45 minutes sequential
  → 48 seconds parallel ($S \approx 56\times$)
- learned more about memory hierarchies than any textbook
  could teach

stack: c++, mpi, openmp, hpc cluster, vtk for
visualisation

the code is messy (academic code always is),

===== END PHYSICAL PAGE 182 =====
===== PHYSICAL PAGE 183 =====

[ ] copied

[N18 continued]

but the experience shaped how i think about
performance-critical systems.

===== END PHYSICAL PAGE 183 =====
