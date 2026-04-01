from collections import defaultdict, deque

def calculate_max_flow(nodes, edges, source, sink, directed=False):
    # Khởi tạo đồ thị với sức chứa
    capacity = defaultdict(lambda: defaultdict(float))
    for edge in edges:
        u, v, cap = edge.source, edge.target, edge.capacity
        if cap < 0:
             return None, "Sức chứa (capacity) không được âm."
        
        capacity[u][v] += cap
        if not directed:
            capacity[v][u] += cap # Cho phép luồng hai chiều nếu undirected
            
    if source not in nodes or sink not in nodes:
        return None, "Nguồn hoặc đích không tồn tại trong tập hợp các nút."

    # Mảng lưu luồng hiện tại
    flow = defaultdict(lambda: defaultdict(float))
    
    steps = [f"Bắt đầu thuật toán Edmonds-Karp từ nguồn {source} đến đích {sink}."]
    max_flow = 0.0

    def bfs(s, t, parent):
        visited = set()
        queue = deque([s])
        visited.add(s)
        
        while queue:
            u = queue.popleft()
            for v in capacity[u]:
                # Xem xét khả năng đi tiếp (sức chứa dư > 0)
                residual_capacity = capacity[u][v] - flow[u][v]
                if v not in visited and residual_capacity > 0:
                    queue.append(v)
                    visited.add(v)
                    parent[v] = u
                    if v == t:
                        return True
        return False

    while True:
        parent = {}
        if not bfs(source, sink, parent):
            break
            
        # Truy vết đường tăng luồng và tìm nghẽn cổ chai (bottleneck)
        path = []
        path_flow = float('inf')
        s = sink
        while s != source:
            u = parent[s]
            path.insert(0, f"({u}->{s})")
            residual_capacity = capacity[u][s] - flow[u][s]
            path_flow = min(path_flow, residual_capacity)
            s = u
            
        # Cập nhật luồng trên dọc đường đó
        s = sink
        while s != source:
            u = parent[s]
            flow[u][s] += path_flow
            flow[s][u] -= path_flow # Luồng ngược (residual flow)
            s = u
            
        max_flow += path_flow
        steps.append(f"Tìm thấy đường tăng luồng: {' -> '.join(path)} với lượng bơm thêm (delta) = {path_flow}.")

    steps.append(f"Thuật toán kết thúc vì không thể dán nhãn chạm tới đích nữa. Tổng Max Flow = {max_flow}.")
    
    # Định dạng mảng flow đầu ra để hiển thị trên frontend
    flow_distribution = {}
    for u in nodes:
        for v in nodes:
            # Để tránh lỗi do flow = 0 ở cung ko tồn tại, chỉ lấy luồng có ý nghĩa theo chiều thuận của cung gốc
            if flow[u][v] >= 0 and capacity[u][v] > 0:
                flow_distribution[f"{u}-{v}"] = {
                    "flow": flow[u][v],
                    "capacity": capacity[u][v]
                }
                
    result_data = {
        "max_flow": max_flow,
        "flow_distribution": flow_distribution,
        "calculation_steps": steps
    }
    
    return result_data, "Success"
