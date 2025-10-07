



# Lazy load heavy functions and completions
zsh_lazy_load() {
    local cmd="$1"
    shift

    # Define function that loads the real command on first use
    eval "$cmd() {
        unfunction $cmd
        # Load the actual implementation here
        $cmd \"\$@\"
    }"
}

# Lazy load common heavy commands
zsh_lazy_load nvm
zsh_lazy_load rvm
zsh_lazy_load pyenv
