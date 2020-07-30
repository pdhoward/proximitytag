
exports.isConnected = (conn) => {
 return !!conn && !!conn.topology && conn.topology.isConnected()
}