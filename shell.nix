let
  sources = import ./nix/sources.nix { };
  pkgs = import sources.nixpkgs { };
in pkgs.mkShell {
  buildInputs = [ pkgs.nixfmt pkgs.nodejs_22 pkgs.nodePackages.pnpm ];
}
