package com.shoppingmall.backend.global.util;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class AhoCorasickFilter {

    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        Node fail;
        String matchWord;
        boolean isEnd = false;
    }

    private Node root = new Node();

    public synchronized void build(List<String> words) {
        Node newRoot = new Node();
        for (String word : words) {
            if (word == null || word.trim().isEmpty()) continue;
            Node current = newRoot;
            for (char ch : word.toCharArray()) {
                current = current.children.computeIfAbsent(ch, k -> new Node());
            }
            current.isEnd = true;
            current.matchWord = word;
        }

        Queue<Node> queue = new LinkedList<>();
        newRoot.fail = newRoot;
        for (Node child : newRoot.children.values()) {
            child.fail = newRoot;
            queue.add(child);
        }

        while (!queue.isEmpty()) {
            Node current = queue.poll();
            for (Map.Entry<Character, Node> entry : current.children.entrySet()) {
                char ch = entry.getKey();
                Node child = entry.getValue();

                Node failNode = current.fail;
                while (failNode != newRoot && !failNode.children.containsKey(ch)) {
                    failNode = failNode.fail;
                }
                if (failNode.children.containsKey(ch)) {
                    child.fail = failNode.children.get(ch);
                } else {
                    child.fail = newRoot;
                }

                if (child.fail.isEnd) {
                    child.isEnd = true;
                    if (child.matchWord == null) {
                        child.matchWord = child.fail.matchWord;
                    }
                }
                queue.add(child);
            }
        }
        this.root = newRoot;
    }

    public List<String> findMatchedBadWords(String text) {
        if (text == null || text.isEmpty()) return List.of();
        List<String> matched = new ArrayList<>();
        Node current = root;
        for (char ch : text.toCharArray()) {
            while (current != root && !current.children.containsKey(ch)) {
                current = current.fail;
            }
            if (current.children.containsKey(ch)) {
                current = current.children.get(ch);
            }
            // 매칭된 노드가 비속어 끝 노드이거나 fail 링크를 따라간 노드가 비속어 끝 노드인 경우
            Node temp = current;
            while (temp != root) {
                if (temp.isEnd && temp.matchWord != null) {
                    matched.add(temp.matchWord);
                }
                temp = temp.fail;
            }
        }
        return matched;
    }
}
