defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

   alias MemoryWeb.Game
  alias MemoryWeb.BackupAgent

  def join("games" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      BackupAgent.put(name, game)
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
end


  # handler for tileClick -> on_click
  def handle_in("click", %{ "tile" => tile }, socket) do
    game = Game.on_click(tile, socket.assigns[:game])
    socket = assign(socket, :game, game)
    name = socket.assigns[:name]
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # handler for checkMatch -> reset_clicked
  def handle_in("reset_click", %{  }, socket) do
    game = Game.reset_clicked(socket.assigns[:game])
    socket = assign(socket, :game, game)
    name = socket.assigns[:name]
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # handler for checkMatch -> not_match
  def handle_in("not_match", %{  }, socket) do
    game = Game.not_match(socket.assigns[:game])
    socket = assign(socket, :game, game)
    name = socket.assigns[:name]
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # handler for restartGame -> new
  def handle_in("new", %{}, socket) do
    game = Game.new()
    socket = assign(socket, :game, game)
    name = socket.assigns[:name]
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
