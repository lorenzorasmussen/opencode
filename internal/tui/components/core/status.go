package core

import (
	"fmt"
	"strings"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/opencode-ai/opencode/internal/config"
	"github.com/opencode-ai/opencode/internal/llm/models"
	"github.com/opencode-ai/opencode/internal/lsp"
	"github.com/opencode-ai/opencode/internal/lsp/protocol"
	"github.com/opencode-ai/opencode/internal/pubsub"
	"github.com/opencode-ai/opencode/internal/session"
	"github.com/opencode-ai/opencode/internal/tui/components/chat"
	"github.com/opencode-ai/opencode/internal/tui/styles"
	"github.com/opencode-ai/opencode/internal/tui/theme"
	"github.com/opencode-ai/opencode/internal/tui/util"
)

type StatusCmp interface {
	tea.Model
	SetHelpWidgetMsg(string)
}

type statusCmp struct {
	info       util.InfoMsg
	width      int
	messageTTL time.Duration
	lspClients map[string]*lsp.Client
	session    session.Session
}

// clearMessageCmd is a command that clears status messages after a timeout
func (m statusCmp) clearMessageCmd(ttl time.Duration) tea.Cmd {
	return tea.Tick(ttl, func(time.Time) tea.Msg {
		return util.ClearStatusMsg{}
	})
}

func (m statusCmp) Init() tea.Cmd {
	return nil
}

func (m statusCmp) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		return m, nil
	case chat.SessionSelectedMsg:
		m.session = msg
	case chat.SessionClearedMsg:
		m.session = session.Session{}
	case pubsub.Event[session.Session]:
		if msg.Type == pubsub.UpdatedEvent {
			if m.session.ID == msg.Payload.ID {
				m.session = msg.Payload
			}
		}
	case util.InfoMsg:
		m.info = msg
		ttl := msg.TTL
		if ttl == 0 {
			ttl = m.messageTTL
		}
		return m, m.clearMessageCmd(ttl)
	case util.ClearStatusMsg:
		m.info = util.InfoMsg{}
	}
	return m, nil
}

var helpWidget = ""

// getHelpWidget returns the help widget with current theme colors
func getHelpWidget(helpText string) string {
	t := theme.CurrentTheme()
	if helpText == "" {
		helpText = "ctrl+? help"
	}

	return styles.Padded().
		Background(t.TextMuted()).
		Foreground(t.BackgroundDarker()).
		Bold(true).
		Render(helpText)
}

func formatTokensAndCost(tokens int64, cost float64) string {
	// Format tokens in human-readable format (e.g., 110K, 1.2M)
	var formattedTokens string
	switch {
	case tokens >= 1_000_000:
		formattedTokens = fmt.Sprintf("%.1fM", float64(tokens)/1_000_000)
	case tokens >= 1_000:
		formattedTokens = fmt.Sprintf("%.1fK", float64(tokens)/1_000)
	default:
		formattedTokens = fmt.Sprintf("%d", tokens)
	}

	// Remove .0 suffix if present
	if strings.HasSuffix(formattedTokens, ".0K") {
		formattedTokens = strings.Replace(formattedTokens, ".0K", "K", 1)
	}
	if strings.HasSuffix(formattedTokens, ".0M") {
		formattedTokens = strings.Replace(formattedTokens, ".0M", "M", 1)
	}

	// Format cost with $ symbol and 2 decimal places
	formattedCost := fmt.Sprintf("$%.2f", cost)

	return fmt.Sprintf("Tokens: %s, Cost: %s", formattedTokens, formattedCost)
}

func (m statusCmp) View() string {
	t := theme.CurrentTheme()

	// Initialize the help widget
	status := getHelpWidget("")

	if m.session.ID != "" {
		tokens := formatTokensAndCost(m.session.PromptTokens+m.session.CompletionTokens, m.session.Cost)
		tokensStyle := styles.Padded().
			Background(t.Text()).
			Foreground(t.BackgroundSecondary()).
			Render(tokens)
		status += tokensStyle
	}

	diagnostics :=
		styles.Padded().Background(t.BackgroundDarker()).Render(m.projectDiagnostics())

	model := m.model()

	statusWidth := max(
		0,
		m.width-
			lipgloss.Width(status)-
			lipgloss.Width(model)-
			lipgloss.Width(diagnostics),
	)

	if m.info.Msg != "" {
		infoStyle := styles.Padded().
			Foreground(t.Background()).
			Width(statusWidth)
		switch m.info.Type {
		case util.InfoTypeInfo:
			infoStyle = infoStyle.Background(t.Info())
		case util.InfoTypeWarn:
			infoStyle = infoStyle.Background(t.Warning())
		case util.InfoTypeError:
			infoStyle = infoStyle.Background(t.Error())
		}

		// Truncate message if it's longer than available width
		msg := m.info.Msg
		availWidth := statusWidth - 10
		if len(msg) > availWidth && availWidth > 0 {
			msg = msg[:availWidth] + "..."
		}
		status += infoStyle.Render(msg)
	} else {
		status += styles.Padded().
			Foreground(t.Text()).
			Background(t.BackgroundSecondary()).
			Width(statusWidth).
			Render("")
	}

	status += diagnostics
	status += model
	return status
}

func (m *statusCmp) projectDiagnostics() string {
	t := theme.CurrentTheme()

	// Check if any LSP server is still initializing
	initializing := false
	for _, client := range m.lspClients {
		if client.GetServerState() == lsp.StateStarting {
			initializing = true
			break
		}
	}

	// If any server is initializing, show that status
	if initializing {
		return lipgloss.NewStyle().
			Foreground(t.Warning()).
			Render(fmt.Sprintf("%s Initializing LSP...", styles.SpinnerIcon))
	}

	errorDiagnostics := []protocol.Diagnostic{}
	warnDiagnostics := []protocol.Diagnostic{}
	hintDiagnostics := []protocol.Diagnostic{}
	infoDiagnostics := []protocol.Diagnostic{}
	for _, client := range m.lspClients {
		for _, d := range client.GetDiagnostics() {
			for _, diag := range d {
				switch diag.Severity {
				case protocol.SeverityError:
					errorDiagnostics = append(errorDiagnostics, diag)
				case protocol.SeverityWarning:
					warnDiagnostics = append(warnDiagnostics, diag)
				case protocol.SeverityHint:
					hintDiagnostics = append(hintDiagnostics, diag)
				case protocol.SeverityInformation:
					infoDiagnostics = append(infoDiagnostics, diag)
				}
			}
		}
	}

	diagnostics := []string{}

	errIcon := styles.CircledDigit(len(errorDiagnostics))
	errStr := lipgloss.NewStyle().
		Background(t.BackgroundDarker()).
		Foreground(t.Error()).
		Render(errIcon)
	diagnostics = append(diagnostics, errStr)

	warnIcon := styles.CircledDigit(len(warnDiagnostics))
	warnStr := lipgloss.NewStyle().
		Background(t.BackgroundDarker()).
		Foreground(t.Warning()).
		Render(warnIcon)
	diagnostics = append(diagnostics, warnStr)

	infoIcon := styles.CircledDigit(len(infoDiagnostics))
	infoStr := lipgloss.NewStyle().
		Background(t.BackgroundDarker()).
		Foreground(t.Info()).
		Render(infoIcon)
	diagnostics = append(diagnostics, infoStr)

	hintIcon := styles.CircledDigit(len(hintDiagnostics))
	hintStr := lipgloss.NewStyle().
		Background(t.BackgroundDarker()).
		Foreground(t.Text()).
		Render(hintIcon)
	diagnostics = append(diagnostics, hintStr)

	return styles.ForceReplaceBackgroundWithLipgloss(
		styles.Padded().Render(strings.Join(diagnostics, "  ")),
		t.BackgroundDarker(),
	)
}

func (m statusCmp) model() string {
	t := theme.CurrentTheme()

	cfg := config.Get()

	coder, ok := cfg.Agents[config.AgentCoder]
	if !ok {
		return "Unknown"
	}
	model := models.SupportedModels[coder.Model]

	return styles.Padded().
		Background(t.Secondary()).
		Foreground(t.Background()).
		Render(model.Name)
}

func (m statusCmp) SetHelpWidgetMsg(s string) {
	// Update the help widget text using the getHelpWidget function
	helpWidget = getHelpWidget(s)
}

func NewStatusCmp(lspClients map[string]*lsp.Client) StatusCmp {
	// Initialize the help widget with default text
	helpWidget = getHelpWidget("")

	return &statusCmp{
		messageTTL: 10 * time.Second,
		lspClients: lspClients,
	}
}
