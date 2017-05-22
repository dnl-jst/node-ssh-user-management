#!/bin/bash

if ! id -u "<%= username %>" > /dev/null 2>&1; then
	useradd -m -s /bin/bash "<%= username %>"
fi

<% if (sudo) { %>
usermod -a -G sudo "<%= username %>"
<% } %>

mkdir -p /home/<%= username %>/.ssh/
echo "<%= publicKey %>" > /home/<%= username %>/.ssh/authorized_keys

echo "processing finished"