# N07 — merkle sync

folder: blog
date: 6 july 2026
slug: merkle-sync

===== PHYSICAL PAGE 044 =====

[ ] copied

[N07]

merkle sync

a from-scratch two-way file sync engine for two
machines on one local network. no http, no
json, no central server, just raw tcp, udp
multicast and a merkle tree. i ran it
between a mac and a windows laptop, which
disagree on what a filename is.

github ↗

why build it

dropbox exists and just works, but i wanted
the primitives underneath it. how do two machines
confirm a terabyte is identical by exchanging thirty-two
bytes. how do they find each other with
no server in the middle. what happens when
the connection dies with a file half sent.
syncthing answers all of that and answers it
well, but reading it is not the same
as building it.

before writing a line i listed the ways
this could lose data, because a sync engine
that loses a file is worse than no

===== END PHYSICAL PAGE 044 =====
===== PHYSICAL PAGE 045 =====

[ ] copied

[N07 continued]

sync engine. the scope is tight on purpose.
two devices, one local network, mac and windows
and a hard list of what i was
not building, global discovery, relays, a gui, a
multi-device index database, delta indexing, at-rest encryption.

the four invariants

data integrity comes first, ahead of speed and
everything else. it comes down to four invariants
in the strict sense, things that have to
hold at every moment and not merely usually.
break one and you get corrupted data.

invariant · guarantee · if it breaks
convergence · once both sides stop changing, equal root hash means equal folder byte for byte · the folders silently diverge
no loss on conflict · concurrent edits keep both versions, the loser is renamed not deleted · an edit is lost
atomic transfer · a killed transfer leaves the old file or the new one, never a splice · a half-written, corrupt file
no sync loop · applying a received file emits zero broadcasts · two peers echo a change forever

the rest of this is how each one
is enforced.

===== END PHYSICAL PAGE 045 =====
===== PHYSICAL PAGE 046 =====

[ ] copied

[N07 continued]

the merkle tree

start with convergence, since it defines what "in
sync" means. the structure is old, the same
one under git and bitcoin. you hash every
file, then hash each folder from the hashes
of its children and those fold upward until
the whole tree reduces to a single root
hash. change one byte in one file and
its leaf hash changes and its parent's and
so on up to the root. the root
is a thirty-two byte fingerprint of the whole
folder.

that gives you a cheap way to find
what differs. two peers compare root hashes. if
they match they are done, the folder is
identical, proven with thirty-two bytes. if the roots
differ they compare the children and recurse only
into the branches that disagree, skipping every subtree
whose hash already matches. for ten thousand files
you walk maybe fifty hashes instead of reading
ten thousand. it is $O(\log n)$ against $O(n)$
for the naive scan.

===== END PHYSICAL PAGE 046 =====
===== PHYSICAL PAGE 047 =====

[ ] copied

[N07 continued]


[CODE START]
  flowchart TB
      subgraph PA["peer a"]
          RA["root 9f2c"]
          DA["docs 7b1c"]
          SA["src e4d9"]
          NA["notes.txt 3a1f"]
          MA["main.go 88de"]
          RA --> DA & SA
          DA --> NA
          SA --> MA
      end
      subgraph PB["peer b"]
          RB["root c70e differs"]
          DB["docs 4e2a differs"]
          SB["src e4d9 same"]
          NB["notes.txt c8d2 differs"]
          MB["main.go 88de same"]
          RB --> DB & SB
          DB --> NB
          SB --> MB
      end
[CODE END]

===== END PHYSICAL PAGE 047 =====
===== PHYSICAL PAGE 048 =====

[ ] copied

[N07 continued]


the walk reads the two roots, sees 9f2c
against c70e and knows something changed. it descends.
src hashes to e4d9 on both, so the
entire src subtree is skipped without a single
file being read. docs differs, so it descends
again and finds that notes.txt is the one
leaf that moved. one file identified, the rest
of the tree never touched.

the leaf

a leaf carries more than a content hash.
two-way sync also needs to know which side
is newer and whether a difference is a
real conflict.

[CODE START]
  type FileInfo struct {
      Path        string                 // canonical forward-slash relative NFC key
      ContentHash [32]byte               // sha-256 of the bytes; tombstone: 32 zero bytes
      Size        uint64                 // bytes; a scan hint, NOT hashed
      Mode        uint32                 // advisory posix mode; NOT hashed
      ModTimeNS   int64                  // mtime; conflict tiebreaker only, NOT hashed

===== END PHYSICAL PAGE 048 =====
===== PHYSICAL PAGE 049 =====

[ ] copied

[N07 continued]

      Version     protocol.VersionVector // causal clock; bumped only on local authorship
      Deleted     bool                   // a delete is a versioned event, not an absence
      Type        FileType               // File | Dir | Symlink
  }
[CODE END]
internal/merkle/fileinfo.go:26

look at what is not hashed. size, mode
and mtime all sit in the struct but
none go into the structural hash. mtime is
the one that matters. it differs on every
machine and it drifts and folding it into
the hash means two files with identical bytes
but different timestamps get different leaf hashes, which
give different folder hashes, which give different roots,
so two byte-identical folders report themselves out of
sync forever. mode is excluded for the same
reason, ntfs cannot represent a posix mode bit
for bit, so the raw mode differs mac
to windows for the same file and hashing
it would create a permanent cross-os disagreement. what
does get hashed is a canonicalised two-state mode,
executable-or-not and symlink-or-not, the only bits that are
portable.

===== END PHYSICAL PAGE 049 =====
===== PHYSICAL PAGE 050 =====

[ ] copied

[N07 continued]


leaves and internal nodes are hashed with a
different one-byte prefix, 0x00 for a leaf and
0x01 for a node. without it an attacker
can construct an internal node whose bytes collide
with a leaf, a second-preimage forgery against the
tree. rfc 9162 mandates the prefix.

version vectors

the merkle tree tells you two files differ,
not which one wins. for that you need
causality and wall-clock time is the wrong tool.
clocks drift between machines, jump an hour for
daylight saving and a laptop that was asleep
wakes with a stale clock. so ordering never
touches mtime, it uses version vectors.

a version vector is a map from device
id to a counter. every time a device
makes a genuine local change to a file
it bumps its own counter. to compare two
versions you walk both vectors together and ask
whether either side knows something the other does

===== END PHYSICAL PAGE 050 =====
===== PHYSICAL PAGE 051 =====

[ ] copied

[N07 continued]

not.

[CODE START]
  func (vv VersionVector) Compare(other VersionVector) Ordering {
      aGreater, bGreater := false, false
      // ... walk both sorted vectors in lock-step ...
      if vv[i].Value > other[j].Value {
          aGreater = true
      } else if vv[i].Value < other[j].Value {
          bGreater = true
      }
      if aGreater && bGreater {
          return Concurrent
      }
      // Equal / Dominates / DominatedBy / Concurrent
  }
[CODE END]
internal/protocol/versionvector.go:158

compare returns one of four orderings.

ordering · example (a vs b) · meaning · action
equal · a=2 b=1 vs a=2 b=1 · same version · nothing to do
dominates · a=2 b=1 vs a=1 b=1 · a has seen everything b has · take a

===== END PHYSICAL PAGE 051 =====
===== PHYSICAL PAGE 052 =====

[ ] copied

[N07 continued]

dominated-by · a=1 b=1 vs a=2 b=1 · b is strictly newer · take b
concurrent · a=2 b=1 vs a=1 b=2 · each side has a change the other lacks · real conflict

concurrent is the case that matters and the
whole two-way engine turns on that distinction, causal
against concurrent.

the counter bumps only on a real local
change, never on applying a file you received,
which is exactly what prevents the sync loop.
the failure mode is subtle. syncthing issue 10590
left permanent stale counters in everyone's vectors after
a device was removed and one user replacing
a device logged 8,591 phantom conflicts. i store
counters as a sorted slice so two semantically
equal vectors encode to identical bytes, which is
what lets a version vector sit inside the
structural hash without breaking convergence.

conflicts

two peers edit the same file while disconnected,
reconnect and the vectors say concurrent. last-writer-wins is
the easy answer and it loses data. so

===== END PHYSICAL PAGE 052 =====
===== PHYSICAL PAGE 053 =====

[ ] copied

[N07 continued]

the loser is renamed to a conflict copy
and kept on disk beside the winner, never
deleted and a human opens both and chooses.

[CODE START]
  sequenceDiagram
      participant A as peer a
      participant B as peer b
      Note over A,B: disconnected
      A->>A: edit file, a=2
      B->>B: edit file, b=2
      Note over A,B: reconnect
      A-->>B: index file, a=2
      B-->>A: index file, b=2
      Note over A,B: concurrent, neither dominates
      A->>A: keep winner + conflict copy
      B->>B: keep winner + conflict copy
[CODE END]

the naming has a trap. the conflict copy's
filename has to be byte-for-byte identical on both
machines or each peer invents a differently-named copy
of the same loser. the obvious name uses
the loser's modification time, except mac stores mtime

===== END PHYSICAL PAGE 053 =====
===== PHYSICAL PAGE 054 =====

[ ] copied

[N07 continued]

in nanoseconds and windows on a fat volume
rounds to two-second granularity, so the same instant
carries two different timestamps depending on the machine.
so the name uses the loser's mtime truncated
to whole seconds, which both agree on. and
the winner keeps its own version vector rather
than merging the loser's in, because merging would
forge a false history where the winner looks
like it descends from the loser and on
a third peer that forged descendant could dominate
and drop the loser with no copy at
all.

the test that guards this is TestConflict_NeitherVersionLostSymmetricName. it
edits a file on both sides while they
are split, reconnects them and asserts that each
peer ends with the winner plus exactly one
conflict copy, that the copy has an identical
name on both and that the two files'
bytes are the two versions that went in.

===== END PHYSICAL PAGE 054 =====
===== PHYSICAL PAGE 055 =====

[ ] copied

[N07 continued]

atomic transfer

the file has to cross the wire and
land on disk without ever existing in a
half-written state. this is the invariant people skip,
because it only fails when a transfer is
interrupted, the wifi dropping at ninety percent.

the durable-write recipe is old and strict.

[CODE START]
  tmp := temp file in the destination's directory
  for chunk in stream:
      write chunk to tmp
      hash.update(chunk)
  if hash.sum != expected:
      delete tmp; abort          # nothing irreversible yet
  fsync(tmp)                     # bytes are on disk
  rename(tmp, destination)       # atomic on mac and windows
  fsync(parent directory)        # the rename survives a power cut
[CODE END]

[CODE START]
  var got [32]byte

===== END PHYSICAL PAGE 055 =====
===== PHYSICAL PAGE 056 =====

[ ] copied

[N07 continued]

  copy(got[:], h.Sum(nil))
  if got != expected {
      return fmt.Errorf("%w: got %x want %x", ErrVerifyFailed, got, expected)
  }
  if err = tmp.Sync(); err != nil { /* ... */ }   // temp bytes hit the disk
  if err = os.Rename(tmpName, dstOSPath); err != nil { /* ... */ }
  committed = true
  if d, derr := os.Open(dir); derr == nil {        // flush the rename itself
      _ = d.Sync()
  }
[CODE END]
internal/reconcile/transfer.go:89

verify-before-rename is what makes a killed transfer safe.
the order matters, verify then rename, never the
reverse. TestKilledTransfer_NoCorruptFileThenRecovers runs a four megabyte file through
a loopback proxy that severs the connection after
ninety-six kilobytes, asserts the receiver has no partial
file and no leftover temp, then reconnects and
asserts the file arrives byte-exact.

===== END PHYSICAL PAGE 056 =====
===== PHYSICAL PAGE 057 =====

[ ] copied

[N07 continued]

the wire protocol

under all of this is a wire protocol,
hand-rolled because a protocol library would have been
more weight than two peers on a lan
need. tcp does not give you messages, it
gives you a stream of bytes with no
boundaries, so the first job is framing, deciding
where one message ends and the next begins.
every frame is a four-byte big-endian length, then
a one-byte type, then that many bytes of
payload. that envelope never changes.

[CODE START]
  flowchart LR
      H["read 5-byte header"] --> G{"len 0 or over 16 MiB?"}
      G -->|yes| D["drop the peer"]
      G -->|no| A["allocate body"]
      A --> R["ReadFull the payload"]
      R --> P["dispatch by type"]
[CODE END]

the length prefix is the dangerous field, since
a peer controls it. if it claims four

===== END PHYSICAL PAGE 057 =====
===== PHYSICAL PAGE 058 =====

[ ] copied

[N07 continued]

gigabytes you must not allocate a four gigabyte
buffer. so two checks run before a single
byte of the body is allocated.

[CODE START]
  length := binary.BigEndian.Uint32(hdr[:])
  // Validate before allocating the body.
  if length == 0 {
      return MsgInvalid, nil, ErrZeroLength
  }
  if length > MaxFrameLen {          // MaxFrameLen = 16 MiB
      return MsgInvalid, nil, ErrFrameTooLarge
  }
  body := make([]byte, length)
  if _, err := io.ReadFull(r, body); err != nil { /* ... */ }
[CODE END]
internal/protocol/framing.go:64

those two checks turn a textbook oom and
an off-by-one stream desync into a dropped connection.
io.ReadFull does the other essential job, because a
single tcp read can hand you half a
frame and code that assumes one read equals
one message corrupts everything downstream the first time

===== END PHYSICAL PAGE 058 =====
===== PHYSICAL PAGE 059 =====

[ ] copied

[N07 continued]

a packet splits.

the message types are a small closed set.

[CODE START]
  const (
      MsgInvalid     MsgType = 0x00 // reserved; receiving it is fatal
      MsgHello       MsgType = 0x01 // handshake: version, device id, root hash
      MsgIndex       MsgType = 0x02 // full index snapshot
      MsgIndexUpdate MsgType = 0x03 // incremental deltas since last index
      MsgRequest     MsgType = 0x04 // i want these bytes of this file
      MsgResponse    MsgType = 0x05 // chunk data or a typed error
      MsgPing        MsgType = 0x06 // keepalive, empty payload
      MsgClose       MsgType = 0x07 // graceful shutdown
  )
[CODE END]
internal/protocol/messages.go:16

0x00 is reserved on purpose, so that a
stray zero byte, the most common thing a
confused or malicious stream sends, is a fatal
error instead of a message that slips through
as valid. codes from 0x08 up are defined
as skippable, so a future version can add

===== END PHYSICAL PAGE 059 =====
===== PHYSICAL PAGE 060 =====

[ ] copied

[N07 continued]

a message type and an old peer just
steps over it, the length prefix already told
it how far to skip.

then trust. there is no server and no
certificate authority, so i use trust on first
use. every device generates a self-signed certificate and
its device id is the sha-256 of that
certificate. the tls config sets InsecureSkipVerify: true, which
sounds like disabling security but does the opposite
here. it turns off the certificate-authority chain, which
is meaningless when there is no authority and
replaces it with a VerifyConnection callback that pins
the peer's certificate hash against an allow-list you
approved out of band. the first time you
connect to a peer you confirm its fingerprint.
every connection after that is the same machine
cryptographically or it is refused. the multicast discovery
that finds peers on the network is only
a hint and a spoofed announcement just points
you at an address whose tls pin then
fails.

===== END PHYSICAL PAGE 060 =====
===== PHYSICAL PAGE 061 =====

[ ] copied

[N07 continued]

filenames across mac and windows

filename handling is the source of most cross-platform
bugs, which is why this targets mac and
windows specifically. the two systems disagree on what
a filename is in four ways, all resolved
at the tree boundary.

problem · what breaks · fix
unicode form · résumé.pdf is nfd on apfs and nfc on windows, so one file looks like two · normalise every path to nfc at the boundary, once
separators · docs/a.txt and docs\a.txt become two keys for one file · store forward-slash only, add the backslash at the os call
reserved names · windows rejects CON PRN NUL and name:stream writes a hidden data stream · escape reversibly on disk, CON becomes %43ON and decodes back
case folding · File.txt and file.txt collide on mac and ntfs · probe the filesystem, refuse and flag

case folding is the subtle one. File.txt and
file.txt are the same file on mac and
ntfs, so a second write must not clobber
the first. the tempting fix is to lower-case
names in memory and compare them, but unicode
case-folding is not the rule ntfs uses internally,
so an in-memory guess disagrees with the real
filesystem at the wrong moment. so instead of
guessing, i ask the filesystem.

===== END PHYSICAL PAGE 061 =====
===== PHYSICAL PAGE 062 =====

[ ] copied

[N07 continued]

[CODE START]
  func probeCaseSensitive(absRoot string) bool {
      lower := filepath.Join(absRoot, ".msync-caseprobe-x")
      upper := filepath.Join(absRoot, ".msync-caseprobe-X")
      os.WriteFile(lower, []byte("x"), 0o600)
      os.WriteFile(upper, []byte("X"), 0o600)
      b, _ := os.ReadFile(lower)
      // on an insensitive fs the upper write clobbered the lower file,
      // so lower now reads "X". the filesystem answered, not a guess.
      return string(b) != "X"
  }
[CODE END]
internal/reconcile/transfer.go:137

write a lowercase x, write an uppercase X,
read the lowercase one back. if it reads
X the two names are the same file
and the volume is case-insensitive, so the engine
refuses the colliding write and flags it instead
of clobbering.

===== END PHYSICAL PAGE 062 =====
===== PHYSICAL PAGE 063 =====

[ ] copied

[N07 continued]

one owner for the tree

all of this runs concurrently over one tree,
which is where a race shows up as
a corrupted file weeks later. the design is
deliberately boring. three listeners, udp discovery, tcp accept
and the filesystem watcher, never call each other
directly, they send messages down channels to a
single core that owns the tree. share memory
by communicating, the old go line, so exactly
one goroutine ever writes the tree.

the tree is guarded by one sync.RWMutex and
the rule that matters most is zero i/o
under the lock. take the lock, copy the
small piece of state you need, release it,
then do the slow thing, the disk read
or the network write. hold the lock across
an i/o call and every other goroutine stalls
behind a network round-trip and a watcher event
and a sync write can deadlock. copy under
the lock, work outside it.

[CODE START]

===== END PHYSICAL PAGE 063 =====
===== PHYSICAL PAGE 064 =====

[ ] copied

[N07 continued]

  flowchart LR
      W["fs watcher"] --> DB["debounce 150ms"]
      DB --> LK["lock, copy subtree"]
      LK --> UN["unlock"]
      UN --> IO["disk + network i/o"]
      IO --> Q{"local change?"}
      Q -->|yes| BC["broadcast index update"]
      Q -->|"no, applied a received file"| NB["no broadcast"]
[CODE END]

two more details matter for concurrency. the watcher
is debounced by a hundred and fifty milliseconds,
because one save from an editor fires a
burst of write events and you want a
single hash-and-diff at the end, not a rescan
on the first of fifteen writes that hashes
a half-saved file. and every goroutine has an
owner. when a peer disconnects, its reader and
writer goroutines are reaped through a WaitGroup, off
the main loop so a slow shutdown never
blocks the engine and TestConnChurn_NoGoroutineLeak connects and disconnects
fifteen times and asserts the goroutine count returns
to its starting value.

===== END PHYSICAL PAGE 064 =====
===== PHYSICAL PAGE 065 =====

[ ] copied

[N07 continued]

breaking the sync loop

which brings back the fourth invariant. the loop
is easy to fall into. peer a changes
a file and broadcasts. peer b receives it
and writes it. b's filesystem watcher, which cannot
tell a received file from a hand-edited one,
fires. if b treats that as a local
change and broadcasts, a sees a fresh version
and the two send the same file back
and forth forever, roots never settling.

the fix is one rule in two places.
a device bumps its version-vector counter only on
a confirmed local change and it broadcasts only
after a confirmed local change. applying a received
file does neither. one function, broadcastUpdate, increments the
outbound counter and the apply path never calls
it.

[CODE START]
  // broadcastUpdate is called ONLY after confirmed local authorship.
  // applying a received file never calls it - the load-bearing half
  // of the no-sync-loop invariant.

===== END PHYSICAL PAGE 065 =====
===== PHYSICAL PAGE 066 =====

[ ] copied

[N07 continued]

  func (e *Engine) broadcastUpdate(changed []merkle.FileInfo) {
      if len(changed) == 0 {
          return
      }
      e.outboundIndexUpdates.Add(1)
      // ... send to peers ...
  }
[CODE END]
internal/reconcile/broadcast.go:56

because that counter exists, the invariant is directly
testable, not just hoped for. TestTwoNode_ReceiverEmitsZeroIndexUpdates has peer
a author one file, waits for the pair
to converge, then asserts the receiver emitted zero
index updates and the author exactly one. that
is stronger than watching the roots settle, which
a slow loop could fake.

the torn read

the invariants above are the clean version. the
build was messier and the worst bug never
tripped a single unit test, the suite stayed
green while the code was broken.

===== END PHYSICAL PAGE 066 =====
===== PHYSICAL PAGE 067 =====

[ ] copied

[N07 continued]


it showed up as a convergence test that
timed out now and then, which looked like
flakiness and was not. the scanner built a
leaf by taking a file's size from one
system call and its content hash from a
separate read and if the file changed between
those two reads, the leaf recorded the old
size with the new hash, a file that
never existed. because the change-detector keys on the
content hash, nothing ever corrected it, the peer
advertised a file it could not produce and
the other side requested it forever. no timeout
can clear it, the peer is wedged for
good.

[CODE START]
  sequenceDiagram
      participant S as scanner
      participant F as file on disk
      S->>F: stat, size = 100
      Note over F: file overwritten, now 400 bytes
      S->>F: read bytes, hash of the 400-byte file
      Note over S: leaf = size 100 + hash of 400

===== END PHYSICAL PAGE 067 =====
===== PHYSICAL PAGE 068 =====

[ ] copied

[N07 continued]

      Note over S: describes a file that never existed
[CODE END]

so the leaf now takes its size and
hash from one atomic read and a test
hammers a file, flipping it between a small
and a large body thousands of times while
the scanner runs and asserts that any leaf
whose hash matches a known version carries that
version's exact size. the second bug in the
same family was a synchronous delete that ran
before the losing file's copy had landed, so
on a delete-against-edit race the edit was gone
before it was saved. both were data-loss bugs
that passed the tests i had. what caught
them was going back to break my own
fix instead of trusting the green tick.

running it

two laptops, one mac, one windows, on the
same wifi. start the daemon on both pointed
at a folder. they find each other over
multicast within a second or two, do the

===== END PHYSICAL PAGE 068 =====
===== PHYSICAL PAGE 069 =====

[ ] copied

[N07 continued]

tls handshake, trade indexes and settle to the
same root hash. change a file on the
mac and it shows up on windows within
a second, roots equal again. edit the same
file on both at once and you get
a winner plus a conflict copy with the
same name on each side. delete on one
and it stays deleted on the other instead
of resurrecting. kill a transfer mid-file and nothing
corrupt is left behind. ci runs the full
race-detector suite on ubuntu, macos and windows on
every change.

the scope is deliberately small. two devices, not
a swarm. one local network, no relays and
no internet-wide discovery. it skips symlinks rather than
guess what they mean across two operating systems,
it does not sync empty directories. a handful
of genuinely ambiguous cases, a file and a
folder colliding on one name, a path too
long for windows, are refused and flagged rather
than resolved by picking one. refusing an ambiguous
case beats silently picking the wrong side.

===== END PHYSICAL PAGE 069 =====
