-- OpenCode Neovim Plugin
-- Integrates OpenCode with Neovim for enhanced coding assistance

local M = {}

-- Default configuration
local config = {
  port = nil, -- Random port if not specified
  command = "opencode",
  auto_start = true,
  keymap = "<leader>oc"
}

-- Merge user config with defaults
function M.setup(user_config)
  config = vim.tbl_extend("force", config, user_config or {})
end

-- Generate a random port
local function get_random_port()
  math.randomseed(os.time())
  return math.random(16384, 65535)
end

-- Start OpenCode server
function M.start_server()
  local port = config.port or get_random_port()
  local cmd = string.format("%s --port %d", config.command, port)

  -- Run in terminal (using toggleterm or built-in terminal)
  vim.cmd("terminal " .. cmd)
  vim.cmd("startinsert")

  -- Store port for later use
  M.port = port

  -- Wait a bit and test connection
  vim.defer_fn(function()
    M.test_connection(port)
  end, 1000)
end

-- Test HTTP connection to OpenCode server
function M.test_connection(port)
  local url = string.format("http://localhost:%d/app", port)
  -- Use curl to test (assuming curl is available)
  local handle = io.popen(string.format("curl -s -o /dev/null -w '%%{http_code}' %s", url))
  local result = handle:read("*a")
  handle:close()

  if result == "200" then
    print("OpenCode server connected on port " .. port)
    M.connected = true
  else
    print("Failed to connect to OpenCode server")
    M.connected = false
  end
end

-- Send prompt to OpenCode
function M.send_prompt(text)
  if not M.port or not M.connected then
    print("OpenCode server not running")
    return
  end

  local url = string.format("http://localhost:%d/tui/append-prompt", M.port)
  local data = string.format('{"text": "%s"}', text:gsub('"', '\\"'))

  local cmd = string.format('curl -s -X POST %s -H "Content-Type: application/json" -d %s', url, data)
  local handle = io.popen(cmd)
  local result = handle:read("*a")
  handle:close()

  print("Prompt sent to OpenCode")
end

-- Get current file reference
function M.get_current_file()
  local buf = vim.api.nvim_get_current_buf()
  local buf_name = vim.api.nvim_buf_get_name(buf)
  local cwd = vim.fn.getcwd()

  -- Get relative path
  local relative_path = buf_name:gsub("^" .. cwd .. "/", "")

  -- Check for selection
  local start_line = nil
  local end_line = nil
  local mode = vim.api.nvim_get_mode().mode

  if mode == "v" or mode == "V" or mode == "<C-V>" then
    local start_pos = vim.fn.getpos("'<")
    local end_pos = vim.fn.getpos("'>")
    start_line = start_pos[2]
    end_line = end_pos[2]
  end

  local file_ref = "@" .. relative_path

  if start_line and end_line then
    if start_line == end_line then
      file_ref = file_ref .. "#L" .. start_line
    else
      file_ref = file_ref .. "#L" .. start_line .. "-" .. end_line
    end
  end

  return file_ref
end

-- Command to open OpenCode
vim.api.nvim_create_user_command("OpenCode", function()
  M.start_server()
end, {})

-- Command to send current file to OpenCode
vim.api.nvim_create_user_command("OpenCodeFile", function()
  local file_ref = M.get_current_file()
  M.send_prompt("In " .. file_ref)
end, {})

-- Set up keymap if configured
if config.keymap then
  vim.api.nvim_set_keymap("n", config.keymap, ":OpenCode<CR>", { noremap = true, silent = true })
  vim.api.nvim_set_keymap("n", config.keymap .. "f", ":OpenCodeFile<CR>", { noremap = true, silent = true })
end

return M