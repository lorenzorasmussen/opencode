# ============================================================================
# 🚀 ZSH RELOAD FUNCTION
# ============================================================================
# Robust reload function that sources each zsh configuration layer individually
# Safe to source in zsh - handles errors gracefully

function reload() {
  echo "🔄 Reloading zsh configuration layer by layer..."

  # 1. Source base configuration (~/.zshrc)
  if [[ -f ~/.zshrc ]]; then
    if source ~/.zshrc; then
      echo "✅ Base configuration loaded (PATH, NVM, XDG vars, history)"
    else
      echo "❌ Failed to load base configuration"
    fi
  else
    echo "⚠️  Base configuration (~/.zshrc) not found"
  fi

  # 2. Source XDG loader (~/.config/zsh/.zshrc)
  if [[ -f ~/.config/zsh/.zshrc ]]; then
    if source ~/.config/zsh/.zshrc; then
      echo "✅ XDG loader loaded (sources 00-main.zsh)"
    else
      echo "❌ Failed to load XDG loader"
    fi
  else
    echo "⚠️  XDG loader not found"
  fi

  # 3. Source main configuration (00-main.zsh)
  if [[ -f ~/.config/zsh/conf.d/00-main.zsh ]]; then
    if source ~/.config/zsh/conf.d/00-main.zsh; then
      echo "✅ Main configuration loaded (core zsh options, sources conf.d files)"
    else
      echo "❌ Failed to load main configuration"
    fi
  else
    echo "⚠️  Main configuration not found"
  fi

  # 4. Source all config files individually (aliases, functions, prompts, themes)
  local conf_dir="${ZDOTDIR:-$HOME/.config/zsh}/conf.d"
  if [[ -d "$conf_dir" ]]; then
    echo "📂 Loading config files..."
    for file in "$conf_dir"/*.zsh; do
      if [[ -f "$file" && "${file##*/}" != "00-main.zsh" ]]; then
        if source "$file"; then
          echo "✅ ${file##*/} loaded"
        else
          echo "❌ Failed to load ${file##*/}"
        fi
      fi
    done
  else
    echo "⚠️  Config directory not found"
  fi

  echo "🎉 Reload complete!"
}