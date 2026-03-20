import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Note = {
    id : Nat;
    title : Text;
    content : Text;
    mode : Text;
    fontStyle : Text;
    penColor : Text;
    paperBackground : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let notes = Map.empty<Principal, Map.Map<Nat, Note>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 0;

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Notes CRUD Operations
  public shared ({ caller }) func createNote(
    title : Text,
    content : Text,
    mode : Text,
    fontStyle : Text,
    penColor : Text,
    paperBackground : Text,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create notes");
    };

    let timestamp = Time.now();
    let id = nextId;
    nextId += 1 : Nat;

    let note : Note = {
      id;
      title;
      content;
      mode;
      fontStyle;
      penColor;
      paperBackground;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    let userNotes = switch (notes.get(caller)) {
      case (null) { Map.empty<Nat, Note>() };
      case (?existing) { existing };
    };

    userNotes.add(id, note);
    notes.add(caller, userNotes);
    id;
  };

  public query ({ caller }) func getNote(noteId : Nat) : async ?Note {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get notes");
    };

    switch (notes.get(caller)) {
      case (null) { null };
      case (?userNotes) { userNotes.get(noteId) };
    };
  };

  public shared ({ caller }) func updateNote(
    noteId : Nat,
    title : Text,
    content : Text,
    mode : Text,
    fontStyle : Text,
    penColor : Text,
    paperBackground : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update notes");
    };

    let userNotes = switch (notes.get(caller)) {
      case (null) { Runtime.trap("Note does not exist") };
      case (?existing) { existing };
    };

    let existingNote = switch (userNotes.get(noteId)) {
      case (null) { Runtime.trap("Note does not exist") };
      case (?note) { note };
    };

    let updatedNote : Note = {
      existingNote with
      title;
      content;
      mode;
      fontStyle;
      penColor;
      paperBackground;
      updatedAt = Time.now();
    };

    userNotes.add(noteId, updatedNote);
  };

  public shared ({ caller }) func deleteNote(noteId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };

    switch (notes.get(caller)) {
      case (null) { Runtime.trap("Note does not exist") };
      case (?userNotes) {
        if (not userNotes.containsKey(noteId)) {
          Runtime.trap("Note does not exist");
        };
        userNotes.remove(noteId);
      };
    };
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get notes");
    };

    switch (notes.get(caller)) {
      case (null) { [] };
      case (?userNotes) { userNotes.values().toArray() };
    };
  };
};
