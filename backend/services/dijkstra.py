import heapq
import math

def calculate_shortest_path(nodes, edges, start_node, target_node, directed=False):
    # Khởi tạo danh sách kề
    adj_list = {node: {} for node in nodes}
    for edge in edges:
        u, v, w = edge.source, edge.target, edge.weight
        if w < 0:
            return None, "Trọng số âm không được hỗ trợ bởi Dijkstra."
        if v not in adj_list[u] or w < adj_list[u][v]:
            adj_list[u][v] = w
        if not directed:
            if u not in adj_list[v] or w < adj_list[v][u]:
                adj_list[v][u] = w
            
    if start_node not in adj_list or target_node not in adj_list:
         return None, "Node bắt đầu hoặc kết thúc không tồn tại."

    # Khởi tạo các cấu trúc dữ liệu
    distances = {node: math.inf for node in nodes}
    distances[start_node] = 0
    previous_nodes = {node: None for node in nodes}
    
    # Priority queue: (chi phí, đỉnh)
    pq = [(0, start_node)]
    
    steps = [f"Bắt đầu tại nút gốc {start_node} với chi phí 0."]
    
    while pq:
        current_dist, current_node = heapq.heappop(pq)
        
        # Bỏ qua nếu đã tìm được đường đi tốt hơn trước đó
        if current_dist > distances[current_node]:
            continue
            
        steps.append(f"Gán nhãn vĩnh viễn cho nút {current_node} = {current_dist}")
        
        if current_node == target_node:
            steps.append(f"Đã đạt đến nút đích {target_node}.")
            break

        for neighbor, weight in adj_list[current_node].items():
            distance = current_dist + weight
            
            # Cập nhật nhãn tạm thời nếu chi phí tốt hơn
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous_nodes[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))
                steps.append(f"Cập nhật nhãn tạm thời cho {neighbor}: đi qua {current_node} với tổng chi phí {distance}")

    if distances[target_node] == math.inf:
        return None, "Không tìm thấy đường đi tới đích."

    # Truy xuất ngược đường đi (Path Retracing)
    path = []
    curr = target_node
    while curr is not None:
        path.insert(0, curr)
        curr = previous_nodes[curr]
        
    result_data = {
        "shortest_distance": distances[target_node],
        "path": path,
        "calculation_steps": steps
    }
    
    return result_data, "Success"
