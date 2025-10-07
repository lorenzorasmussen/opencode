sysinfo() {
    echo "=== System Information ==="
    echo "OS: $(uname -s) $(uname -r)"
    echo "Kernel: $(uname -v)"
    echo "Architecture: $(uname -m)"
    echo "Hostname: $(hostname)"
    echo "Uptime: $(uptime | awk '{print $3,$4}' | sed 's/,//')"
    echo "CPU: $(sysctl -n machdep.cpu.brand_string 2>/dev/null || grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | sed 's/^ *//')"
    echo "Memory: $(echo "scale=2; $(sysctl -n hw.memsize 2>/dev/null || grep MemTotal /proc/meminfo | awk '{print $2}') / 1024 / 1024 / 1024" | bc 2>/dev/null || echo "Unknown") GB"
    echo "Disk Usage:"
    df -h | head -n 5
}



# Configuration backup function
backup-config() {
