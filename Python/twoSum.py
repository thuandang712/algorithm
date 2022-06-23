# Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

# Input: nums = [2,7,11,15], target = 9
# Output: [0,1]
# Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # using hash map
        hash = {}

        # loop thru nums list
        for i, n in enumerate(nums):
            # find the diff = target - nums[i]
            diff = target - n  # diff = 7
            # if diff in hash return [n,diff]
            if diff in hash:
                return [hash[diff], i]
            # if diff not in hash -> add to hashmap
            hash[n] = i

        return False


sol = Solution()
nums = [2, 7, 11, 15]
# hash = {
# 2: 0,
# 7: 1,
# 11: 2,
# 15: 3
# }
target = 8
res = sol.twoSum(nums, target)
print(res)
