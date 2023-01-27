from contextlib import nullcontext


class Node:
    data = None
    next_node = None

    def __init__(self, data):
        self.data = data

    def __repr__(self):
        return "<Node data: %s>" % self.data


class LinkedList:
    def __init__(self):
        self.head = None

    def isEmpty(self):
        return self.head == None

    def size(self):
        current = self.head
        count = 0
        while current:
            count += 1
            current = current.next_node
        return count

    def addToHead(self, data):
        new_node = Node(data)
        new_node.next_node = self.head
        self.head = new_node


l = LinkedList()
l.addToHead(1)
l.addToHead(2)
print(l)
