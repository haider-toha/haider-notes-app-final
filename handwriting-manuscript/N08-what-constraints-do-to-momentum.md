# N08 — what constraints do to momentum

folder: blog
date: 3 july 2026
slug: what-constraints-do-to-momentum

===== PHYSICAL PAGE 070 =====

[ ] copied

[N08]

what constraints do to momentum

dynamical systems was the one course at uni
that actually grabbed me, so on a slow
afternoon last week i tried to see how
much trouble i could get into. picked three
systems on purpose to be awkward, none of
them the usual pendulums, each with a constraint
that does something it shouldn't. derived everything by
hand, wrote my own integrator and recomputed the
energy from scratch every step.

the first is a solid cylinder rolling back
and forth inside a curved cradle and the
cradle is bolted to a cart that slides
freely on a frictionless track. nothing pushes the
cart and nothing rubs anywhere, yet it slides
steadily left and right the whole time the
cylinder rocks. i take $\mathbf{q} = (x, \theta)$,
the cart position and the angle of the
cylinder's centre from the bottom of the bowl
and the centre orbits the cradle at radius
$b = R - r$. rolling without slipping
ties the cylinder's spin to its swing and
because the cradle only translates the condition integrates,
so it is holonomic.

===== END PHYSICAL PAGE 070 =====
===== PHYSICAL PAGE 071 =====

[ ] copied

[N08 continued]


r\,\dot\psi = -(R-r)\,\dot\theta \quad\Longrightarrow\quad \dot\psi = -\frac{b}{r}\,\dot\theta

i use it to remove $\psi$ before writing
anything down. the kinetic energy carries the cart,
the orbiting centre and the spin with $I
= \tfrac12 m r^2$ and gravity gives a
potential that is not zero.

T = \tfrac12(M+m)\,\dot{x}^2 + m b\cos\theta\,\dot{x}\,\dot{\theta} + \tfrac34 m b^2\dot{\theta}^2, \qquad V = -\,m g b\cos\theta

that $\tfrac34$ is the moment of inertia showing
up, one half from moving the centre and
one quarter from the spin. with $\mathcal{L} =
T - V$ the Euler-Lagrange equations collapse to
the reduced pair $M(\mathbf{q})\ddot{\mathbf{q}} = F$.

\begin{bmatrix} M+m & m b\cos\theta \\ \cos\theta & \tfrac32 b \end{bmatrix} \begin{bmatrix} \ddot{x} \\ \ddot{\theta} \end{bmatrix} = \begin{bmatrix} m b\sin\theta\,\dot{\theta}^2 \\ -\,g\sin\theta \end{bmatrix}

the coordinate i wanted to watch is $x$.
it never appears in $\mathcal{L}$, only $\dot{x}$ does,
so it is cyclic, its momentum is fixed
and since the system starts from rest that
constant stays zero forever.

===== END PHYSICAL PAGE 071 =====
===== PHYSICAL PAGE 072 =====

[ ] copied

[N08 continued]


p_x = (M+m)\,\dot{x} + m b\cos\theta\,\dot{\theta} = 0

nothing frictional is holding the centre of mass
in place; the rolling constraint is doing it
and the cart has to recoil exactly opposite
the cylinder to keep the sum at zero.

[IMAGE: interactive simulation of a solid cylinder rolling inside a curved cradle bolted to a free-sliding cart (rolling_system_minimal.html)]

watch the cart slide against the cylinder while
the centre of the whole picture stays pinned
and the red marker on the rim turns
in lockstep with the swing. the motion is
liveliest at the ends, where the cylinder turns
around and drags the cart's recoil back with
it.

the second system trades the free support for
a hard kinematic law. two cranks turn on
fixed parallel axles, each rigidly keyed to a
spur gear and the gears mesh, so turning
one crank forces the other to counter-rotate at
a fixed ratio. a double pendulum hangs off

===== END PHYSICAL PAGE 072 =====
===== PHYSICAL PAGE 073 =====

[ ] copied

[N08 continued]

the first crank and a single one off
the second, with gravity the only driver. i
integrate four coordinates, $\mathbf{q} = (\theta_1, \phi_a, \phi_b,
\phi_c)$ and the second crank is missing on
purpose, because two pitch circles rolling without slip
trade equal and opposite arc, a holonomic relation
between the angles themselves.

R_1\theta_1 = -R_2\theta_2 \quad\Longrightarrow\quad \theta_2 = -\rho\,\theta_1, \qquad \rho = \frac{R_1}{R_2}

folding it into the coordinates turns five rigid
rods into a four-coordinate problem with no multiplier
to drag around. the kinetic energy is the
usual quadratic form in the rates and the
potential pulls the gear ratio inside a trig
function through $\sin(\rho\theta_1)$, so the Lagrangian and its
reduced equations are

\mathcal{L} = \tfrac12\,\dot{\mathbf{q}}^{\mathsf{T}} M(\mathbf{q})\,\dot{\mathbf{q}} - V(\mathbf{q}), \qquad M(\mathbf{q})\,\ddot{\mathbf{q}} = F(\mathbf{q}, \dot{\mathbf{q}}),

which i solve each step by Gaussian elimination.
this time no coordinate is cyclic. $\theta_1$ sits
in the potential as itself and again inside
$\sin(\rho\theta_1)$, so there is no ignorable coordinate and

===== END PHYSICAL PAGE 073 =====
===== PHYSICAL PAGE 074 =====

[ ] copied

[N08 continued]

no conserved momentum at all. you might expect
the gears to bank angular momentum like a
flywheel, but both axles are bolted down and
gravity keeps torquing every rod, so nothing rotational
survives either. the only invariant left is energy.

E = T + V = \text{const}

the two pendulum trains never couple directly, which
i didn't expect. the single pendulum reaches the
rest of the system through one off-diagonal entry
against the crank and sits at exactly zero
against the double pendulum's angles. the mesh is
the only thing that connects them.

[IMAGE: interactive simulation of two meshed spur-gear cranks with a double pendulum and a single pendulum (gear-twin-crank_minimal.html)]

the two cranks stay mirror images, turning opposite
ways at the fixed ratio and the double
pendulum can whip the first crank hard enough
to jerk the second one across the loop,
a kick with no contact between them, passed
through the teeth.

===== END PHYSICAL PAGE 074 =====
===== PHYSICAL PAGE 075 =====

[ ] copied

[N08 continued]

the third system doesn't conserve momentum at all,
on purpose. a rigid chassis coasts on frictionless
ice on a single knife-edge blade that can
slide along its heading but never sideways and
a cam at its centre wags a follower
rod through a groove. there is no motor
and no friction and it still eases forward
and drifts into a slow turn, changing its
own speed with nothing pushing on it. i
take $\mathbf{q} = (x, y, \theta, \psi)$, the
chassis centre, its heading and the cam angle.
the groove is holonomic and folds straight in;
the blade is not. it forbids any sideways
velocity, a single scalar condition on the speeds
that won't integrate.

-\,\dot{x}\sin\theta + \dot{y}\cos\theta + a\dot\theta = 0

this is nonholonomic. it removes a speed, not
a coordinate, so the pose keeps all four
freedoms while the velocities drop to three. gravity
points out of the plane and the ice
carries it, so $V = 0$ and the
Lagrangian is all kinetic. the equations come from

===== END PHYSICAL PAGE 075 =====
===== PHYSICAL PAGE 076 =====

[ ] copied

[N08 continued]

Euler-Lagrange with the constraint carried by a multiplier,

\frac{d}{dt}\!\left(\frac{\partial \mathcal{L}}{\partial \dot{\mathbf{q}}}\right) - \frac{\partial \mathcal{L}}{\partial \mathbf{q}} = \mathbf{A}_{\mathbf{q}}^{\mathsf{T}}\lambda, \qquad \mathbf{A}_{\mathbf{q}} = (-\sin\theta,\ \cos\theta,\ a,\ 0),

and because the blade does no work along
the motions it permits, projecting onto the admissible
directions kills the multiplier and leaves a clean
$3\times 3$ solve $M(\psi)\ddot{\mathbf{q}} = F$. $\lambda$ itself
has not disappeared, though; the one in-plane external
force on the machine is that blade reaction,
so the total momentum obeys

\frac{d\mathbf{p}}{dt} = \lambda\,\hat{e}_2 \neq 0,

and every time the wag drives $\lambda$ off
zero, the centre of mass gains speed it
had no other way to get. the constraint
does no work, so it can't change $E$,
but it can still redirect the motion already
there, rectifying the follower's back-and-forth into a one-way
drift. energy is again the only invariant, $E
= T = \text{const}$.

[IMAGE: interactive simulation of a cam-wagged coasting skater on a knife-edge blade (cam-skater_minimal.html)]

===== END PHYSICAL PAGE 076 =====
===== PHYSICAL PAGE 077 =====

[ ] copied

[N08 continued]


the forward speed keeps changing with nothing pushing
the skater and the carved track bends with
nothing steering it.

all three run the same way, classical RK4
at a fixed step of one or two
milliseconds, eight to sixteen substeps a frame. the
energy number in the corner of each one
is the part i actually trust, because i
compute it twice and the two ways do
not share any algebra. rather than read the
kinetic energy back off the same $M$ and
$F$ that pushed the state forward, which would
only prove my solver is consistent with itself,
each step rebuilds $E$ from the plain per-body
kinematics, the cartesian velocity and height of every
mass and never touches the reduced equations. if
the algebra were wrong the true energy would
drift and this number would wander off with
it. it held flat in all three, somewhere
between a part in a million and a
part in $10^{11}$, which is how i knew
the derivations were right.

===== END PHYSICAL PAGE 077 =====
===== PHYSICAL PAGE 078 =====

[ ] copied

[N08 continued]


three different fates for momentum. pinned at zero
in the cradle, drained through the bearings in
the gear train, walked across the ice in
the skater. same culprit every time, a constraint
force that does no work. was a fun
afternoon.

===== END PHYSICAL PAGE 078 =====
