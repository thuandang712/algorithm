# Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

# Ex1: nums = [1,2,3,1]
# output: true

# Ex2: nums = [1,2,3,4]
# output: false


class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        hashset = set()
        for n in nums:
            if n in hashset:
                return True
            hashset.add(n)

        return False


solution = Solution()
nums = [1, 2, 3, 1]
print(solution.containsDuplicate(nums))
