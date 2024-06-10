(*******************************************************************)
(*     This is part of WhyMon, and it is distributed under the     *)
(*     terms of the GNU Lesser General Public License version 3    *)
(*           (see file LICENSE for more details)                   *)
(*                                                                 *)
(*  Copyright 2023:                                                *)
(*  Leonardo Lima (UCPH)                                           *)
(*******************************************************************)

open Base
open Etc
open Checker_interface

module Plain : sig

  val expls: ((timestamp * timepoint) * Expl.t) list ->
             (bool * Checker_pdt.t * Checker_trace.t) list option ->
             ((Dom.t, Dom.comparator_witness) Setc.t list list option list) option ->
             Formula.t option -> Argument.Mode.t -> unit

end

module Json : sig

  val table_columns: Formula.t -> string

  val db: timestamp -> timepoint -> Db.t -> Formula.t -> string

  val expls: (timepoint, timestamp) Hashtbl.t -> Formula.t -> Expl.t list -> string list

  val aggregate: string list -> string list -> string -> string

end
