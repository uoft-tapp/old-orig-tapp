class Position < ApplicationRecord
  belongs_to :course
  has_many :assignments
  has_many :preferences
end
