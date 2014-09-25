module Clustering

  class Cluster
    attr_accessor :value, :nodes
    def initialize(value)
      @value = value
    end
  end

  # {{{ two means
  # This is an implementation of a 2-means clustering algorighm for 1d nodes (reals).
  # It will return two instances of Cluster, both containing a value (the center), and the nodes associated to the cluster
  def twomeans(ary)

    v1,v2 = [ary.min,ary.max]
    m1 = Cluster.new([v1,v2].min)
    m2 = Cluster.new([v1,v2].max)

    count = 0
    loop do 
      count +=1
      old_v1 = m1.value
      old_v2 = m2.value

      m1.nodes = []
      m2.nodes = []
      ary.each do |x|
        if (x - m1.value).abs < (x - m2.value).abs
          m1.nodes << x
        else
          m2.nodes << x
        end
      end

      v1 = (m1.nodes.reduce(:+)).to_f/m1.nodes.size rescue 0
      v2 = (m2.nodes.reduce(:+)).to_f/m2.nodes.size rescue 0

      break if (v1 - old_v1).abs < 1e-6 and (v2 - old_v2).abs < 1e-6
      break if count > 1000

      m1.value,m2.value = [v1,v2].sort 
    end

    return [m1,m2]
  end
  #}}}

end

