workspace(name = "pfv")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "bazel_skylib",
    sha256 = "1c531376ac7e5a180e0237938a2536de0c54d93f5c278634818e0efc952dd56c",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "452bef42c4b2fbe0f509a2699ffeb3ae2c914087736b16314dbd356f3641d7e5",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/2.3.0/rules_nodejs-2.3.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    node_version = "14.15.1",
    yarn_version = "1.22.10",
    node_repositories = {
        "14.15.1-darwin_amd64": ("node-v14.15.1-darwin-x64.tar.gz", "node-v14.15.1-darwin-x64", "9154d9c3f598d3efe6d163d160a7872ddefffc439be521094ccd528b63480611"),
        "14.15.1-linux_amd64": ("node-v14.15.1-linux-x64.tar.xz", "node-v14.15.1-linux-x64", "608732c7b8c2ac0683fee459847ad3993a428f0398c73555b9270345f4a64752"),
        "14.15.1-windows_amd64": ("node-v14.15.1-win-x64.zip", "node-v14.15.1-win-x64", "cb1ec98baf6f19e432250573c9aba9faa6b4104517b6a49b05aa5f507f6763fd"),
    },
    yarn_repositories = {
        "1.5.1": ("yarn-v1.22.10.tar.gz", "yarn-v1.22.10", "7e433d4a77e2c79e6a7ae4866782608a8e8bcad3ec6783580577c59538381a6e"),
    },
    node_urls = ["https://nodejs.org/dist/v{version}/{filename}"],
    yarn_urls = ["https://github.com/yarnpkg/yarn/releases/download/v{version}/{filename}"],
    package_json = ["//:package.json"]
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    symlink_node_modules = False,
    yarn_lock = "//:yarn.lock",
)

# Docker base images.
http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "1698624e878b0607052ae6131aa216d45ebb63871ec497f26c67455b34119c80",
    strip_prefix = "rules_docker-0.15.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.15.0/rules_docker-v0.15.0.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)
container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("@io_bazel_rules_docker//repositories:pip_repositories.bzl", "io_bazel_rules_docker_pip_deps")

io_bazel_rules_docker_pip_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)

container_pull(
    name = "nodejs_base",
    # This digest is for tag "12.18.4".
    digest = "sha256:68c289263bc39ba0f1d46b76a3df61477ccf07d6fcb7a00e2769e8d91265ca3e",
    registry = "index.docker.io",
    repository = "library/node",
)

container_pull(
    name = "alpine_linux_amd64",
    registry = "index.docker.io",
    repository = "library/alpine",
    tag = "3.8",
)

load(
    "@io_bazel_rules_docker//nodejs:image.bzl",
    _nodejs_image_repos = "repositories",
)

_nodejs_image_repos()
